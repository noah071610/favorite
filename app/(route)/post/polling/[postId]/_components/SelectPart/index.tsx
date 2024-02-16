"use client"

import { usePostStore } from "@/_store/post"
import { fadeMoveUpAnimation, scaleUpAnimation } from "@/_styles/animation"
import classNames from "classnames"
import "./style.scss"

export default function SelectPart({ onClickSubmit }: { onClickSubmit: () => void }) {
  const { selectedCandidate } = usePostStore()
  return (
    <>
      {selectedCandidate ? (
        <div key={selectedCandidate.listId} className={classNames("select-part")}>
          <div
            style={{
              background: `url('${selectedCandidate.imageSrc}') center / cover`,
              ...scaleUpAnimation(250),
            }}
            className="select-part-image"
          />
          <div className="select-part-description">
            <h2 style={fadeMoveUpAnimation(500, 100)}>{selectedCandidate.title}</h2>
            {selectedCandidate.description?.trim() && (
              <p style={fadeMoveUpAnimation(510, 150)}>{selectedCandidate.description}</p>
            )}
          </div>
          <div className="select-part-btn">
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
