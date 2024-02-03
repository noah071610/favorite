"use client"

import { CandidateType, useMainStore } from "@/_store"
import { fadeMoveUpAnimation } from "@/_utils/animation"
import { candidates } from "@/_utils/faker"
import classNames from "classnames"
import { useSearchParams } from "next/navigation"
import "./style.scss"

export default function CandidatesPage() {
  const { selectedCandidate, setSelectedCandidate } = useMainStore()

  const searchParams = useSearchParams()
  const isResultPage = !!searchParams.get("result")

  const onClickSelect = (candidate: CandidateType) => {
    setSelectedCandidate(candidate)
  }

  return (
    <ul className="candidate-list">
      {candidates.map((candidate, index) => (
        <li key={candidate.listId}>
          <div
            onClick={() => onClickSelect(candidate)}
            style={fadeMoveUpAnimation(1100 + index * 20, index * 100)}
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
        </li>
      ))}
    </ul>
  )
}
