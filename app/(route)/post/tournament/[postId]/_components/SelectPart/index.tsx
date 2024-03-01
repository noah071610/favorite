"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"

import Candidate from "@/(route)/post/contest/[postId]/_components/Candidate"
import { setParticipate } from "@/_hooks/useSetParticipate"
import { finishPlay } from "@/_queries/post"
import { ContestCandidateType } from "@/_types/post/contest"
import { TournamentCandidateType, TournamentPostType } from "@/_types/post/tournament"
import { shuffleArray } from "@/_utils/math"
import classNames from "classNames"
import { produce } from "immer"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function SelectPart({
  originCandidates,
  setPickedCandidate,
  setStatus,
  setPost,
  post,
  round,
  isPreview,
}: {
  originCandidates: TournamentCandidateType[]
  setPickedCandidate: (target: TournamentCandidateType) => void
  setStatus: (type: "init" | "result") => void
  setPost: Dispatch<SetStateAction<TournamentPostType>>
  round: number
  post: TournamentPostType
  isPreview: boolean
}) {
  const [candidates, setCandidates] = useState<TournamentCandidateType[]>(
    (shuffleArray(originCandidates) as TournamentCandidateType[]).slice(0, round)
  )
  const [out, setOut] = useState<boolean[]>(Array.from({ length: round }, () => false))
  const [curIndex, setCurIndex] = useState(0)
  const [curRound, setCurRound] = useState(round)
  const [roundStatus, setRoundStatus] = useState({ pending: false, display: false })

  const [imageLoadedCount, setImageLoadedCount] = useState(0)

  const swiped = async (direction: "left" | "right", target: TournamentCandidateType | ContestCandidateType) => {
    const index = curIndex + direction === "left" ? 0 : 1
    const select = target as TournamentCandidateType

    if (curIndex + 2 >= curRound) {
      if (curRound === 2) {
        if (!isPreview) {
          await finishPlay(
            post.postId as string,
            produce(post, (draft) => {
              const target = draft.content.candidates[select.number - 1]
              target.pick = target.pick + 1
            })
          )
          setParticipate({ listId: select.listId, postId: post.postId })
        }

        setPost((post) =>
          produce(post, (draft) => {
            const target = draft.content.candidates[select.number - 1]
            target.pick = target.pick + 1
          })
        )
        setPickedCandidate(select)

        setTimeout(() => {
          setStatus("result")
        }, 500)
        return
      }

      setTimeout(() => {
        setRoundStatus({ display: false, pending: false })
      }, 500) // 토너먼트 라운드가 끝나고 요소 지움

      setTimeout(() => {
        setOut((arr) =>
          produce(arr, (draft) => {
            draft[curIndex + (index === 0 ? 1 : 0)] = true
          })
        )
        setCurRound((num) => num / 2)
        setCandidates((arr) => shuffleArray(arr))
        setOut((arr) => arr.filter((v) => !v))
        setCurIndex(0)

        const obj: { [key: string]: boolean } = {}
        setCandidates((arr) =>
          arr.filter((v, i) => {
            obj[v.number] = !out[i]
            return !out[i]
          })
        ) // 여기서 요소 길이 변동! 이미지 로딩 시작

        setPost((post) =>
          produce(post, (draft) => {
            Object.entries(obj).forEach(([num, isWin]) => {
              const target = draft.content.candidates[+num - 1]
              if (isWin) {
                target.win = target.win + 1
              } else {
                target.lose = target.lose + 1
              }
            })
          })
        )
      }, 600) // 후다닥 작업

      setTimeout(() => {
        setRoundStatus((v) => ({ ...v, pending: true }))
      }, 2500 + 500)
      // 스와이프 낭비시간 + 애니메이션 시간 후 다음 라운드 ㄱㄱ
      // ...하기전 잠시 이미지 때문에 펜딩!
    } else {
      setOut((arr) =>
        produce(arr, (draft) => {
          draft[curIndex + (index === 0 ? 1 : 0)] = true
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
    candidates.slice(curIndex, curIndex + 2).map((v, cardIndex) => (
      <div key={v.listId} className={cx(style[cardIndex === 0 ? "left" : "right"])}>
        <Candidate candidate={v} swiped={swiped} direction={cardIndex === 0 ? "left" : "right"} />
      </div>
    ))
  ) : (
    <div className={cx(style["next-round"])}>
      <div className={cx(style.inner)}>
        <i className={cx("fa-solid", "fa-rocket")} />
        <h1>
          {curRound === 2 && "결승전(2강)"}
          {curRound === 4 && "준결승전(4강)"}
          {curRound > 4 && `${curRound}강`}
        </h1>
      </div>
    </div>
  )
}
