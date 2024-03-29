"use client"

import { useEffect, useState } from "react"

import Candidate from "@/_components/Select"
import { usePlayMutation } from "@/_hooks/mutations/usePlayMutation"
import { setParticipate } from "@/_hooks/useSetParticipate"
import { CandidateType, PostType, TournamentCandidateOnGameType } from "@/_types/post"
import { shuffleArray } from "@/_utils/math"
import { useTranslation } from "@/i18n/client"
import { faRocket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { produce } from "immer"
import { cloneDeep } from "lodash"
import { useParams } from "next/navigation"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function SelectPart({
  originCandidates,
  setPickedCandidate,
  setStatus,
  post,
  round,
  isPreview,
}: {
  originCandidates: CandidateType[]
  setPickedCandidate: (target: CandidateType) => void
  setStatus: (type: "init" | "result") => void
  round: number
  post: PostType
  isPreview: boolean
}) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["post-page"])
  const [candidates, setCandidates] = useState<TournamentCandidateOnGameType[]>(
    shuffleArray(originCandidates.map((v) => ({ ...v, out: false }))).slice(0, round)
  )
  const [dataMap, setDataMap] = useState(
    originCandidates.reduce((acc: { [key: string]: { win: number; lose: number } }, cur) => {
      acc[cur.listId] = {
        win: 0,
        lose: 0,
      }
      return acc
    }, {})
  )
  const [curIndex, setCurIndex] = useState(0)
  const [curRound, setCurRound] = useState(round)
  const [roundStatus, setRoundStatus] = useState({ pending: false, display: false })

  const [imageLoadedCount, setImageLoadedCount] = useState(0)

  const { mutate } = usePlayMutation(post.postId)

  const displayCandidates = candidates.slice(curIndex, curIndex + 2)

  const swiped = async (direction: "left" | "right", target: TournamentCandidateOnGameType) => {
    const winIndex = direction === "left" ? 0 : 1
    const loseIndex = winIndex === 1 ? 0 : 1

    if (curRound > 2) {
      setDataMap((obj) =>
        produce(obj, (draft) => {
          draft[displayCandidates[winIndex].listId].win += 1
          draft[displayCandidates[loseIndex].listId].lose += 1
        })
      )
    }

    if (curIndex + 2 >= curRound) {
      if (curRound === 2) {
        const finishedPost = cloneDeep({
          ...post,
          count: post.count + 1,
          content: {
            ...post.content,
            candidates: post.content.candidates.map((v) => {
              if (v.listId === target.listId) {
                return {
                  ...v,
                  pick: v.pick + 1,
                  win: v.win + dataMap[v.listId].win + 1,
                  lose: v.lose + dataMap[v.listId].lose,
                }
              }
              return {
                ...v,
                win: v.win + dataMap[v.listId].win,
                lose: v.lose + dataMap[v.listId].lose + (displayCandidates[loseIndex].listId === v.listId ? 1 : 0),
              }
            }),
          },
        })
        if (!isPreview) {
          mutate(finishedPost)
          setParticipate({ listId: target.listId, postId: post.postId })
        }

        delete target.out
        setPickedCandidate(target)

        setTimeout(() => {
          setStatus("result")
        }, 500)
        return
      }

      setTimeout(() => {
        setRoundStatus({ display: false, pending: false })
      }, 500) // 2. 스와이프 대기

      setTimeout(() => {
        //3. 라운드를 올리고, 후보를 솎아준다.

        setCandidates((arr) => {
          let _arr = cloneDeep(arr)
          _arr[curIndex + loseIndex].out = true
          _arr = shuffleArray(_arr.filter(({ out }) => !out))
          return _arr
        })

        setCurRound((num) => num / 2)
        setCurIndex(0)
      }, 600) // 후다닥 작업

      setTimeout(() => {
        setRoundStatus((v) => ({ ...v, pending: true }))
      }, 2500 + 500)
      // 스와이프 낭비시간 + 애니메이션 시간 후 다음 라운드 ㄱㄱ
      // ...하기전 잠시 이미지 때문에 펜딩!
    } else {
      setCandidates((arr) =>
        produce(arr, (draft) => {
          draft[curIndex + loseIndex].out = true
        })
      )
      setTimeout(() => {
        setCurIndex((i) => i + 2)
      }, 500)
    }
  }

  useEffect(() => {
    if (typeof round === "number") {
      setTimeout(() => {
        setRoundStatus((v) => ({ ...v, display: true }))
      }, 2500)
    }
  }, [round]) // memo: 토너먼트 시작시 한 번만 적용

  useEffect(() => {
    if (imageLoadedCount !== 0) {
      if (imageLoadedCount >= candidates.length && roundStatus.pending) {
        setRoundStatus({ pending: false, display: true })
      }
    }
  }, [candidates.length, imageLoadedCount, roundStatus.pending])

  useEffect(() => {
    candidates.forEach(({ imageSrc }) => {
      const image = new Image()
      image.src = imageSrc
      image.onload = () => {
        setImageLoadedCount((prevCount) => prevCount + 1)
      }
      image.onerror = () => {
        setImageLoadedCount((prevCount) => prevCount + 1)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates]) // memo: 라운드 변경시 이미지 로드

  return roundStatus.display ? (
    <>
      {displayCandidates.map((v, cardIndex) => (
        <div key={v.listId} className={cx(style[cardIndex === 0 ? "left" : "right"])}>
          <Candidate candidate={v} swiped={swiped} direction={cardIndex === 0 ? "left" : "right"} />
        </div>
      ))}
    </>
  ) : (
    <div className={cx(style["next-round"])}>
      <div className={cx(style.inner)}>
        <FontAwesomeIcon icon={faRocket} />
        <h1>
          {curRound === 2 && t("finals")}
          {curRound === 4 && t("semiFinals")}
          {curRound > 4 && `${curRound}${t("teams")}`}
        </h1>
      </div>
    </div>
  )
}
