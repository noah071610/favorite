"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"

import Candidate from "@/(route)/post/contest/[postId]/_components/Candidate"
import { ContestCandidateType } from "@/_types/post/contest"
import { TournamentCandidateType } from "@/_types/post/tournament"
import { shuffleArray } from "@/_utils/math"
import classNames from "classNames"
import { produce } from "immer"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function SelectPart({
  originCandidates,
  setPickedCandidate,
  setStatus,
  setOriginCandidates,
  round,
}: {
  originCandidates: TournamentCandidateType[]
  setPickedCandidate: (target: TournamentCandidateType) => void
  setStatus: (type: "init" | "result") => void
  setOriginCandidates: Dispatch<SetStateAction<TournamentCandidateType[]>>
  round: number
}) {
  const [candidates, setCandidates] = useState<TournamentCandidateType[]>(
    (shuffleArray(originCandidates) as TournamentCandidateType[]).slice(0, round)
  )
  const [out, setOut] = useState<boolean[]>(Array.from({ length: round }, () => false))
  const [curIndex, setCurIndex] = useState(0)
  const [curRound, setCurRound] = useState(round)
  const [displayNextRound, setDisplayNextRound] = useState(false)

  const swiped = (direction: "left" | "right", target: TournamentCandidateType | ContestCandidateType) => {
    const index = curIndex + direction === "left" ? 0 : 1
    const select = target as TournamentCandidateType
    if (curIndex + 2 >= curRound) {
      if (curRound === 2) {
        setOriginCandidates((arr) =>
          produce(arr, (draft) => {
            const target = draft[select.number - 1]
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
        setDisplayNextRound(false)
      }, 500)
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
        )

        setOriginCandidates((arr) =>
          produce(arr, (draft) => {
            Object.entries(obj).forEach(([num, isWin]) => {
              const target = draft[+num - 1]
              if (isWin) {
                target.win = target.win + 1
              } else {
                target.lose = target.lose + 1
              }
            })
          })
        )
      }, 600)
      setTimeout(() => {
        setDisplayNextRound(true)
      }, 2500 + 500)
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
        setDisplayNextRound(true)
      }, 2500)
    }
  }, [round])

  return displayNextRound ? (
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
