"use client"

import { CandidateType, useMainStore } from "@/_store"
import { fadeMoveUpAnimation } from "@/_utils/animation"
import { candidates } from "@/_utils/faker"
import classNames from "classnames"
import { usePathname } from "next/navigation"
import "./style.scss"

export default function DefaultCandidatesPage() {
  const { viewCandidates, selectedCandidate, setSelectedCandidate, addViewCandidate, removeViewCandidate } =
    useMainStore()

  const pathname = usePathname()

  const isResultPage = !!pathname.includes("result")

  const onClickSelect = (candidate: CandidateType) => {
    if (isResultPage) {
      if (viewCandidates.find(({ listId }) => listId === candidate.listId)) {
        removeViewCandidate(candidate.listId)
      } else {
        addViewCandidate(candidate)
      }
    } else {
      setSelectedCandidate(candidate)
    }
  }

  const _candidates = [...candidates].sort((a, b) => b.count - a.count)

  return (
    <ul className="candidate-list">
      {_candidates.map((candidate, index) => (
        <li key={candidate.listId}>
          <div
            onClick={() => onClickSelect(candidate)}
            style={fadeMoveUpAnimation(1100 + index * 20, index * 100)}
            className={classNames("candidate-card", {
              selected: !isResultPage && selectedCandidate?.listId === candidate.listId,
              onView: viewCandidates.find(({ listId }) => listId === candidate.listId),
            })}
          >
            {index === 0 && (
              <img
                className="number-one"
                src={`/images/ranking/number_${index + 1}.png`}
                alt={`ranking_number_${index + 1}`}
              />
            )}
            <div style={{}} className="number">
              {index + 1}
            </div>
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
