"use client"
import Link from "next/link"

import { useMainStore } from "@/_store"
import { fadeMoveUpAnimation } from "@/_utils/animation"
import { dummyPostCards } from "@/_utils/faker"
import "./style.scss"

export default function ContentsPage() {
  const { postId } = dummyPostCards[0]
  const { selectedCandidate } = useMainStore()

  return (
    <>
      {selectedCandidate ? (
        <div key={selectedCandidate.listId} className="submit">
          <div
            style={{
              background: `url('${selectedCandidate.imageSrc}') center / cover`,
              animation: "scale-up 250ms ease-out forwards",
            }}
            className="submit-image"
          ></div>
          <div className="submit-description">
            <h2 style={fadeMoveUpAnimation(500, 100)}>{selectedCandidate.title}</h2>
            <p style={fadeMoveUpAnimation(510, 150)}>{selectedCandidate.description}</p>
          </div>
          <div className="submit-btn">
            <Link style={fadeMoveUpAnimation(530, 210)} href={`/post/${postId}/result`}>
              <span>{selectedCandidate.title} 선택</span>
            </Link>
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
