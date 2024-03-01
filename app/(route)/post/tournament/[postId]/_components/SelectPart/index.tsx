"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"

import Candidate from "@/(route)/post/contest/[postId]/_components/Candidate"
import { setParticipate } from "@/_hooks/useSetParticipate"
import { finishPlay } from "@/_queries/post"
import { ContestCandidateType } from "@/_types/post/contest"
import { TournamentCandidateOnGameType, TournamentCandidateType, TournamentPostType } from "@/_types/post/tournament"
import { shuffleArray } from "@/_utils/math"
import classNames from "classNames"
import { produce } from "immer"
import { cloneDeep } from "lodash"
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
  const [candidates, setCandidates] = useState<TournamentCandidateOnGameType[]>(
    shuffleArray(originCandidates.map((v) => ({ ...v, out: false }))).slice(0, round)
  )
  const [curIndex, setCurIndex] = useState(0)
  const [curRound, setCurRound] = useState(round)
  const [roundStatus, setRoundStatus] = useState({ pending: false, display: false })

  const [imageLoadedCount, setImageLoadedCount] = useState(0)

  const swiped = async (direction: "left" | "right", target: TournamentCandidateOnGameType | ContestCandidateType) => {
    const targetIndex = direction === "left" ? 1 : 0
    const select = target as TournamentCandidateOnGameType

    if (curIndex + 2 >= curRound) {
      if (curRound === 2) {
        if (!isPreview) {
          await finishPlay(
            post.postId as string,
            produce(post.content, (draft) => {
              const target = draft.candidates[select.number - 1]
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

        delete select.out
        setPickedCandidate(select)

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
          _arr[curIndex + targetIndex].out = true
          _arr = shuffleArray(_arr.filter(({ out }) => !out))
          return _arr
        })

        setCurRound((num) => num / 2)
        setCurIndex(0)

        setPost((post) =>
          produce(post, (draft) => {
            let _arr = cloneDeep(candidates) // candidates는 비동기이기 때문에 수정되기 전
            _arr[curIndex + targetIndex].out = true
            _arr.forEach(({ out, number }) => {
              const target = draft.content.candidates[+number - 1]
              // find보다 단순 인덱스가 더 쉽기 때문에 인덱스로 찾음
              // number는 index + 1으로 이미 posting할때 셋팅해놓음
              if (out) {
                target.lose += 1
              } else {
                target.win += 1
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
      setCandidates((arr) =>
        produce(arr, (draft) => {
          draft[curIndex + targetIndex].out = true
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
