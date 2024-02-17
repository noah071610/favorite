"use client"

import { usePostStore } from "@/_store/post"
import { ContestContentType } from "@/_types/post/post"
import classNames from "classnames"
import { produce } from "immer"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import TinderCard from "react-tinder-card"

export default function SelectPart({
  content,
  setContent,
  setSelected,
  direction,
}: {
  content: ContestContentType
  setContent: Dispatch<SetStateAction<ContestContentType | null>>
  setSelected: Dispatch<SetStateAction<"left" | "right" | null>>
  direction: "left" | "right"
}) {
  const { setIsResultPage } = usePostStore()
  const candidate = content[direction]
  const cardRef = useRef<HTMLDivElement | null>(null)

  const swiped = () => {
    setContent((content) => {
      return produce(content, (draft) => {
        if (draft) {
          // todo: api 요청시 옵티미스틱 유아이로
          draft[direction].count += 1
        }
      })
    })
    setSelected(direction)
    setTimeout(() => {
      setIsResultPage(true)
    }, 700)
  }

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
    <div ref={cardRef} className={classNames("contest-candidate")}>
      <TinderCard className={classNames("card swipe-card", `swipe-card-${direction}`)} onSwipe={swiped}>
        <div
          style={{
            backgroundImage: `url('${candidate.imageSrc}')`,
          }}
          className={classNames("thumbnail")}
        ></div>
        <div
          className="thumbnail-overlay"
          style={{
            backgroundImage: `url('${candidate.imageSrc}')`,
          }}
        ></div>
        <div className="description">
          <div className="title-wrapper">
            <h1 className="title">{candidate?.title}</h1>
          </div>
        </div>
      </TinderCard>
      <div className={classNames("contest-candidate-background", `contest-candidate-background-${direction}`)}>
        <span>LIKE!</span>
      </div>
    </div>
  )
}
