"use client"

import { PostContentType, useNewPostStore } from "@/_store/newPost"

import classNames from "classnames"
import "./style.scss"

const typeSelectors = [
  {
    value: "polling",
    label: "투표",
    children: (
      <>
        <i className="fa-solid fa-chart-simple symbol" />
      </>
    ),
  },
  {
    value: "contest",
    label: "1:1 대결",
    children: (
      <>
        <span className="symbol contest">VS</span>
      </>
    ),
  },
  {
    value: "tournament",
    label: "월드컵",
    children: (
      <>
        <i className="fa-solid fa-trophy" />
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
    <div className="init">
      <div className="type-wrapper">
        <h1>콘텐츠 타입을 선택해주세요</h1>
        <div className="type-list">
          {typeSelectors.map(({ value, children, label }) => (
            <button
              onClick={() => onClickTypeSelect(value as PostContentType)}
              key={`type_selector_${value}`}
              className={classNames(`type-${value}`, { active: newPost?.type === value })}
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
