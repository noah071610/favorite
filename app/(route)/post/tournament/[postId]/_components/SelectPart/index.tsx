"use client"

import { usePostStore } from "@/_store/post"
import { useEffect, useState } from "react"

import { TournamentCandidateType } from "@/_types/post/tournament"
import { shuffleArray } from "@/_utils/math"
import classNames from "classNames"
import style from "../../candidate.module.scss"
const cx = classNames.bind(style)

const _rounds = [4, 8, 16, 32, 64, 128]

const getRound = (totalParticipants: number) => {
  for (let i = 0; i < _rounds.length; i++) {
    if (_rounds[i] >= totalParticipants) {
      return { rounds: _rounds.slice(0, i) }
    }
  }
  return { rounds: 0 }
}

export default function SelectPart({ initialCandidates }: { initialCandidates: TournamentCandidateType[] }) {
  const [candidates, setCandidates] = useState<TournamentCandidateType[]>(initialCandidates)
  // const [candidates, setCandidates] = useState<number>(initialCandidates.length)
  const { setIsResultPage } = usePostStore()
  const { rounds } = getRound(initialCandidates.length)
  useEffect(() => {
    setCandidates(shuffleArray(initialCandidates))
  }, [initialCandidates])

  return (
    <div className={cx(style.candidate)}>
      <div className={cx(style["candidate-inner"])}>
        <div
          style={{
            backgroundImage: `url('${candidate.imageSrc}')`,
          }}
          className={cx(style.thumbnail)}
        ></div>
        <div
          className={cx(style["thumbnail-overlay"])}
          style={{
            backgroundImage: `url('${candidate.imageSrc}')`,
          }}
        ></div>
        <div className={cx(style.description)}>
          <div className={cx(style["title-wrapper"])}>
            <h1 className={cx(style.title)}>{candidate?.title}</h1>
          </div>
        </div>
      </div>
      <div className={cx(style["candidate-background"], style[direction])}>
        <span>LIKE!</span>
      </div>
    </div>
  )
}
