"use client"

import { useEffect, useRef } from "react"
import TinderCard from "react-tinder-card"

import { getImageUrl } from "@/_data"
import { TournamentCandidateType } from "@/_types/post"
import { ContestCandidateType } from "@/_types/post/contest"
import classNames from "classNames"

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
      cardRef.current?.classList.add("active")
    }
    const mouseUp = () => {
      setTimeout(() => {
        cardRef.current?.classList.remove("active")
      }, 150)
    }

    if (cardRef.current) {
      cardRef.current.addEventListener("touchstart", mouseDown)
      cardRef.current.addEventListener("touchend", mouseUp)
      cardRef.current.addEventListener("mousedown", mouseDown)
      cardRef.current.addEventListener("mouseup", mouseUp)
    }

    // 컴포넌트가 언마운트되면 이벤트 핸들러를 제거
    return () => {
      if (cardRef.current) {
        cardRef.current.addEventListener("touchstart", mouseDown)
        cardRef.current.addEventListener("touchend", mouseUp)
        cardRef.current.removeEventListener("mousedown", mouseDown)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        cardRef.current.removeEventListener("mouseup", mouseUp)
      }
    }
  }, [cardRef])

  console.log(candidate)

  return (
    <div ref={cardRef} className={classNames("global-select", "select-part", direction)}>
      <TinderCard
        className={classNames("global-select-inner", "swipe-inner", direction)}
        onSwipe={() => swiped(direction, candidate)}
      >
        <div
          style={{
            backgroundImage: getImageUrl({ url: candidate.imageSrc }),
          }}
          className={classNames("thumbnail")}
        ></div>
        <div
          className={classNames("thumbnail-overlay")}
          style={{
            backgroundImage: getImageUrl({ url: candidate.imageSrc }),
          }}
        ></div>
        <div className={classNames("description")}>
          <div className={classNames("title-wrapper")}>
            <h1 className={classNames("title")} dangerouslySetInnerHTML={{ __html: candidate?.title ?? "" }}></h1>
          </div>
        </div>
      </TinderCard>
      <div className={classNames("global-select-background", direction)}>
        <span>LIKE!</span>
      </div>
    </div>
  )
}
