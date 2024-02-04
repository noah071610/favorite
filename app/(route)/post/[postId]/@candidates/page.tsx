"use client"

import useIntersectionObserver from "@/_hooks/useIntersectionObserver"
import { CandidateType, useMainStore } from "@/_store"
import { fadeMoveUpAnimation } from "@/_utils/animation"
import { candidates } from "@/_utils/faker"
import classNames from "classnames"
import { usePathname } from "next/navigation"
import { useMemo, useRef } from "react"
import CountUp from "react-countup"
import "./style.scss"

export default function CandidatesPage() {
  const { viewCandidates, selectedCandidate, setSelectedCandidate, addViewCandidate, removeViewCandidate } =
    useMainStore()

  const pathname = usePathname()
  const isResultPage = !!pathname.includes("result")

  const topRef = useRef<HTMLLIElement | null>(null)
  const isReachedTop = useIntersectionObserver(topRef)

  const bottomRef = useRef<HTMLLIElement | null>(null)
  const isReachedBottom = useIntersectionObserver(bottomRef)

  const onClickSelect = (candidate: CandidateType) => {
    if (isResultPage) {
      // memo: 결과페이지 통계 보기용
      if (viewCandidates.find(({ listId }) => listId === candidate.listId)) {
        removeViewCandidate(candidate.listId)
      } else {
        addViewCandidate(candidate)
      }
    } else {
      // memo: 투표페이지에서 후보 선택
      setSelectedCandidate(candidate)
    }
  }

  const _candidates = useMemo(
    () => (isResultPage ? [...candidates].sort((a, b) => b.count - a.count) : candidates),
    [isResultPage]
  ) // todo: 서버에서 받으면 수정

  return (
    <ul className="candidate-list">
      {!isResultPage && !isReachedTop && <div className="gradient top-div"></div>}
      {_candidates.map((candidate, index) => (
        <li
          ref={
            isResultPage ? undefined : index === 0 ? topRef : index === candidates.length - 1 ? bottomRef : undefined
          }
          key={`${candidate.listId}_${isResultPage ? "result" : "vote"}`}
        >
          <div
            onClick={() => onClickSelect(candidate)}
            style={fadeMoveUpAnimation(1100 + index * 20, index * 100)}
            className={classNames("candidate-card", {
              // memo: selected->투표페이지에서 선택, onView: 결과페이지 통계 보기용
              selected: !isResultPage && selectedCandidate?.listId === candidate.listId,
              onView: viewCandidates.find(({ listId }) => listId === candidate.listId),
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
      {!isResultPage && !isReachedBottom && <div className="gradient bottom-div"></div>}
    </ul>
  )
}
