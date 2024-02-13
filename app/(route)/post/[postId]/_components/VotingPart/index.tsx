"use client"

import { fadeMoveUpAnimation, scaleUpAnimation } from "@/_styles/animation"
import { ListType } from "@/_types/post"
import classNames from "classnames"
import "./style.scss"

export default function VotingPart({
  onClickSubmit,
  selectedCandidate,
}: {
  onClickSubmit: () => void
  selectedCandidate: ListType | null
}) {
  return (
    <>
      {selectedCandidate ? (
        <div key={selectedCandidate.listId} className={classNames("voting")}>
          <div
            style={{
              background: `url('${selectedCandidate.imageSrc}') center / cover`,
              ...scaleUpAnimation(250),
            }}
            className="voting-image"
          />
          <div className="voting-description">
            <h2 style={fadeMoveUpAnimation(500, 100)}>{selectedCandidate.title}</h2>
            {selectedCandidate.description?.trim() && (
              <p style={fadeMoveUpAnimation(510, 150)}>{selectedCandidate.description}</p>
            )}
          </div>
          <div className="voting-btn">
            <a onClick={onClickSubmit} style={fadeMoveUpAnimation(530, 210)}>
              <span>{selectedCandidate.title} 선택</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="unselected">
          <div>
            <span>후보를 선택해주세요</span>
          </div>
        </div>
      )}
    </>
  )
}
