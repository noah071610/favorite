"use client"

import { CandidateType, usePostStore } from "@/_store/post"
import { fadeMoveUpAnimation } from "@/_styles/animation"
import classNames from "classnames"
import { Dispatch, SetStateAction, useMemo } from "react"
import CountUp from "react-countup"
import "./style.scss"

export default function Candidates({
  candidates,
  isResultPage,
  votedListId,
  selectedCandidate,
  setSelectedCandidate,
}: {
  candidates: CandidateType[]
  isResultPage: boolean
  selectedCandidate: CandidateType | null
  votedListId: string | undefined
  setSelectedCandidate: Dispatch<SetStateAction<CandidateType | null>>
}) {
  const { setViewCandidate } = usePostStore()

  const onClickSelect = (candidate: CandidateType) => {
    !isResultPage && setSelectedCandidate(candidate)
  }
  const onMouseEnterCard = (candidate: CandidateType) => {
    setViewCandidate(candidate)
  }
  const onMouseLeaveCard = () => {
    setViewCandidate(null)
  }

  const _candidates = useMemo(
    () => (isResultPage ? [...candidates].sort((a, b) => b.count - a.count) : candidates),
    [candidates, isResultPage]
  ) // todo: 서버에서 받으면 수정

  const isSelected = (candidate: CandidateType) => (selectedCandidate?.listId || votedListId) === candidate.listId

  return (
    <ul className="candidate-list">
      {_candidates.map((candidate, index) => (
        <li
          onClick={() => onClickSelect(candidate)}
          onMouseEnter={() => onMouseEnterCard(candidate)}
          onMouseLeave={onMouseLeaveCard}
          style={fadeMoveUpAnimation(1100 + index * 20, index * 100)}
          key={`${candidate.listId}_${isResultPage ? "result" : "vote"}`}
        >
          <div
            className={classNames("candidate-card-bg", {
              selected: isSelected(candidate),
            })}
          ></div>
          <div
            className={classNames("candidate-card", {
              selected: isSelected(candidate),
            })}
          >
            {/* memo: 결과 페이지만 적용 */}
            {isResultPage && (
              <>
                {index === 0 && (
                  <img
                    className="number-one"
                    src={`/images/ranking/number_${index + 1}.png`}
                    alt={`ranking_number_${index + 1}`}
                  />
                )}
                <div className="number">{index + 1}</div>
              </>
            )}

            <div className={classNames("candidate-card-inner", { isResultPage })}>
              <div className="candidate-image-wrapper">
                <div
                  style={{
                    background: `url('${candidate.imageSrc}') center / cover`,
                  }}
                  className="candidate-image"
                />
              </div>
              <div className="candidate-description">
                <h3>
                  {candidate.title}
                  {isResultPage && (
                    <span className="count">
                      <CountUp prefix="(" suffix="표)" duration={4} end={candidate.count} />
                    </span>
                  )}
                </h3>
                <p>{candidate.description}</p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
