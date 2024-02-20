"use client"

import { usePostStore } from "@/_store/post"
import { ContestContentType } from "@/_types/post/post"
import { produce } from "immer"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import TinderCard from "react-tinder-card"

import classNames from "classNames"
import style from "../../candidate.module.scss"
const cx = classNames.bind(style)

export default function SelectPart({
  content,
  setContent,
  setSelected,
  direction,
  selected,
}: {
  selected: "left" | "right" | null
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
      <TinderCard className={cx(style["candidate-inner"], style["swipe-inner"], style[direction])} onSwipe={swiped}>
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
      </TinderCard>
      <div className={cx(style["candidate-background"], style[direction])}>
        <span>LIKE!</span>
      </div>
    </div>
  )
}
