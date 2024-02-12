"use client"

import { useNewPostStore } from "@/_store/newPost"

import "./style.scss"

export default function InitEditSection() {
  const { newPost, newCandidates, setSelectedCandidate, setNewPost, setSection, clearCandidate } = useNewPostStore()

  return (
    <div className="init">
      <div className="type-wrapper">
        <h1>콘텐츠 타입을 선택해주세요</h1>
        <div className="type-list">
          <button className="type-vote">
            <div>
              <i className="fa-solid fa-chart-simple symbol" />
            </div>
            <span>투표</span>
          </button>
          <button className="type-vs">
            <div>
              <span className="symbol vs">VS</span>
            </div>
            <span>1:1 대결</span>
          </button>
          <button className="type-tournament">
            <div>
              <i className="fa-solid fa-trophy" />
            </div>
            <span>월드컵</span>
          </button>
        </div>
      </div>
    </div>
  )
}
