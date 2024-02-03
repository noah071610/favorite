"use client"

import classNames from "classnames"
import { Dispatch } from "react"
import "./style.scss"

export default function CandidateCard({
  selectedCandidate,
  candidate,
  setSelectedCandidate,
  isResultPage,
  index,
}: {
  selectedCandidate: any
  candidate: any
  setSelectedCandidate: Dispatch<any>
  isResultPage: boolean
  index: number
}) {
  return (
    <div
      onClick={() => {
        setSelectedCandidate(candidate)
      }}
      style={{
        animation: `fade-move-up ${1100 + index * 20}ms ${index * 100}ms cubic-bezier(0,1.1,.78,1) forwards`,
      }}
      className={classNames("candidate-card", {
        selected: !isResultPage && selectedCandidate?.listId === candidate.listId,
      })}
    >
      <div className="candidate-card-inner">
        <div className="candidate-image-wrapper">
          <div
            style={{
              background: `url('${candidate.image_src}') center / cover`,
            }}
            className="candidate-image"
          />
        </div>
        <div className="candidate-description">
          <h3>{candidate.title}</h3>
          <p>{candidate.description}</p>
        </div>
      </div>
    </div>
  )
}
