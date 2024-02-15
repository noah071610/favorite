"use client"

import { useNewPostStore } from "@/_store/newPost"

import classNames from "classnames"
import "./style.scss"

const typeSelectors = [
  {
    value: "vote",
    label: "투표",
    children: (
      <>
        <i className="fa-solid fa-chart-simple symbol" />
      </>
    ),
  },
  {
    value: "vs",
    label: "1:1 대결",
    children: (
      <>
        <span className="symbol vs">VS</span>
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

export default function InitEditSection() {
  const { newPost, newCandidates, setSelectedCandidate, setNewPost, setSection, clearCandidate } = useNewPostStore()
  const onClickTypeSelect = (value: string) => {
    setNewPost({ type: value })
    setSection("edit")
  }
  return (
    <div className="init">
      <div className="type-wrapper">
        <h1>콘텐츠 타입을 선택해주세요</h1>
        <div className="type-list">
          {typeSelectors.map(({ value, children, label }) => (
            <button
              onClick={() => onClickTypeSelect(value)}
              key={`type_selector_${value}`}
              className={classNames(`type-${value}`, { active: newPost?.type.includes(value) })}
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
