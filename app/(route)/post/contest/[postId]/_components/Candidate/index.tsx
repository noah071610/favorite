"use client"

import { useEffect, useRef } from "react"
import TinderCard from "react-tinder-card"

import { getImageUrl } from "@/_data"
import { ContestCandidateType } from "@/_types/post/contest"
import { TournamentCandidateType } from "@/_types/post/tournament"
import classNames from "classNames"
import style from "../candidate.module.scss"
const cx = classNames.bind(style)

export default function Candidate({
  candidate,
  direction,
  swiped,
}: {
  candidate: ContestCandidateType | TournamentCandidateType
  direction: "left" | "right"
  swiped: (direction: "left" | "right", target: ContestCandidateType | TournamentCandidateType) => void
}) {
  const cardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mouseDown = () => {
      cardRef.current?.classList.add(style.active)
    }
    const mouseUp = () => {
      setTimeout(() => {
        cardRef.current?.classList.remove(style.active)
      }, 150)
    }

    if (cardRef.current) {
      cardRef.current.addEventListener("mousedown", mouseDown)
      cardRef.current.addEventListener("mouseup", mouseUp)
    }

    // 컴포넌트가 언마운트되면 이벤트 핸들러를 제거
    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener("mousedown", mouseDown)
        cardRef.current.removeEventListener("mouseup", mouseUp)
      }
    }
  }, [cardRef])

  return (
    <div ref={cardRef} className={cx(style.candidate, style["select-part"], style[direction])}>
      <TinderCard
        className={cx(style["candidate-inner"], style["swipe-inner"], style[direction])}
        onSwipe={() => swiped(direction, candidate)}
      >
        <div
          style={{
            backgroundImage: getImageUrl({ url: candidate.imageSrc }),
          }}
          className={cx(style.thumbnail)}
        ></div>
        <div
          className={cx(style["thumbnail-overlay"])}
          style={{
            backgroundImage: getImageUrl({ url: candidate.imageSrc }),
          }}
        ></div>
        <div className={cx(style.description)}>
          <div className={cx(style["title-wrapper"])}>
            <h1 className={cx(style.title)}>{candidate?.title}</h1>
          </div>
        </div>
      </TinderCard>
      <div className={cx(style["candidate-background"], style[direction])}>
        <span>LIKE!</span>
      </div>
    </div>
  )
}
