"use client"

import { useMainStore } from "@/_store/main"
import classNames from "classnames"
import "./style.scss"

export default function CreateCandidateModal() {
  const { modalStatus } = useMainStore()

  return (
    <div className={classNames("create-candidate-modal", { active: modalStatus === "createCandidate" })}>
      <button className="single">
        <div className="frame">
          <i className="fa-regular fa-pen-to-square" />
        </div>
        <span>한 개 생성</span>
      </button>
      <button className="multiple">
        <div className="frame">
          <i className="fa-solid fa-list" />
        </div>
        <span>여러 개 생성</span>
      </button>
    </div>
  )
}
