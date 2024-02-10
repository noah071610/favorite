"use client"

import { usePostStore } from "@/_store/post"
import { usePostingStore } from "@/_store/posting"
import { fadeMoveUpAnimation } from "@/_styles/animation"
import { CandidateType } from "@/_types/post"
import classNames from "classnames"
import React, { useEffect, useState } from "react"
import CountUp from "react-countup"
import "./style.scss"

function Candidate({
  isResultPage,
  votedListId,
  selectedCandidate,
  setSelectedCandidate,
  isEdit,
  candidate,
  index,
}: {
  isResultPage?: boolean
  isEdit?: boolean
  selectedCandidate: CandidateType | null
  setSelectedCandidate: (state: CandidateType | null) => void
  votedListId?: string
  candidate: CandidateType
  index: number
}) {
  const { count, description, listId, title, imageSrc, animation } = candidate
  const [isDeleting, setIsDeleting] = useState(false)
  const { setViewCandidate } = usePostStore()
  const { deleteCandidate, setSelectedCandidate: setSelectedNewCandidate, newCandidates } = usePostingStore()

  const onClickSelect = (candidate: CandidateType) => {
    !isResultPage && setSelectedCandidate(candidate)
  }
  const onMouseEnterCard = (candidate: CandidateType) => {
    setViewCandidate(candidate)
  }
  const onMouseLeaveCard = () => {
    setViewCandidate(null)
  }

  const deleteNewCandidate = () => {
    setIsDeleting(true)
  }

  useEffect(() => {
    if (isDeleting) {
      setSelectedNewCandidate(newCandidates.length === 1 ? null : newCandidates[index === 0 ? 1 : index - 1])
      setTimeout(() => {
        deleteCandidate(listId)
      }, 480)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleting, listId])

  const isSelected = (selectedCandidate?.listId || votedListId) === listId

  //todo: 왕관 왜 안나와...

  return (
    <li
      onClick={() => onClickSelect(candidate)}
      onMouseEnter={() => onMouseEnterCard(candidate)}
      onMouseLeave={onMouseLeaveCard}
      style={
        animation
          ? {
              animation: isDeleting
                ? "candidate-delete 500ms"
                : animation === "fade-up"
                ? `fade-move-up ${1100 + index * 20}ms ${index * 100}ms cubic-bezier(0,1.1,.78,1) forwards`
                : `${animation} 500ms forwards`,
            }
          : fadeMoveUpAnimation(1100 + index * 20, index * 100)
      }
    >
      <div
        className={classNames("candidate-card-bg", {
          selected: isSelected,
        })}
      ></div>
      <div
        className={classNames("candidate-card", {
          selected: isSelected,
        })}
      >
        {isEdit && !isResultPage && (
          <button onClick={deleteNewCandidate} className="delete-candidate">
            <i className="fa-solid fa-x"></i>
          </button>
        )}
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
            <div className="number ranking">{index + 1}</div>
          </>
        )}

        <div className={classNames("candidate-card-inner", { isResultPage })}>
          <div className="candidate-image-wrapper">
            {imageSrc ? (
              <div
                style={{
                  background: `url('${imageSrc}') center / cover`,
                }}
                className="candidate-image"
              />
            ) : (
              <div className="no-candidate-image">
                <i className="fa-regular fa-image"></i>
              </div>
            )}
          </div>
          <div className="candidate-description">
            <h3>
              <span className="title">{title.trim() ? title : "후보명 입력 (필수)"}</span>
              {isResultPage && (
                <span className="count">
                  <CountUp prefix="(" suffix="표)" duration={4} end={count} />
                </span>
              )}
            </h3>
            {isEdit && !isResultPage && !description && <p className="place-holder">후보 설명 입력 (옵션)</p>}
            {description && <p>{description}</p>}
          </div>
        </div>
      </div>
    </li>
  )
}

export default React.memo(Candidate)
