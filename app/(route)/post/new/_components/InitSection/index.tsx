"use client"

import { useNewPostStore } from "@/_store/newPost"
import { PostContentType } from "@/_types/post/post"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const typeSelectors = [
  {
    value: "polling",
    label: "투표",
    children: (
      <>
        <i className={cx("fa-solid", "fa-chart-simple", style.symbol)} />
      </>
    ),
  },
  {
    value: "contest",
    label: "1:1 대결",
    children: (
      <>
        <span className={cx(style.symbol, style.contest)}>VS</span>
      </>
    ),
  },
  {
    value: "tournament",
    label: "월드컵",
    children: (
      <>
        <i className={cx("fa-solid", "fa-trophy")} />
      </>
    ),
  },
]

export default function InitSection() {
  const { newPost, setNewPost, setStatus } = useNewPostStore()
  const onClickTypeSelect = (value: PostContentType) => {
    setNewPost({ type: "type", payload: value })
    setStatus("edit")
  }
  return (
    <div className={cx(style.init)}>
      <div className={cx(style["type-wrapper"])}>
        <h1>콘텐츠 타입을 선택해주세요</h1>
        <div className={cx(style["type-list"])}>
          {typeSelectors.map(({ value, children, label }) => (
            <button
              onClick={() => onClickTypeSelect(value as PostContentType)}
              key={`type_selector_${value}`}
              className={cx(`type-${value}`, { [style.active]: newPost?.type === value })}
            >
              <div>{children}</div>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
