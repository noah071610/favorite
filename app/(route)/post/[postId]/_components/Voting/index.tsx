"use client"

import { fadeMoveUpAnimation, scaleUpAnimation } from "@/_styles/animation"
import { CandidateType, VoteIdType } from "@/_types/post"
import { useParams } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import "./style.scss"

export default function Voting({
  setVotedId,
  selectedCandidate,
}: {
  setVotedId: Dispatch<SetStateAction<VoteIdType | null>>
  selectedCandidate: CandidateType | null
}) {
  const { postId } = useParams<{ postId: string }>()

  const onClickSubmit = () => {
    if (selectedCandidate) {
      const participated: string[] = JSON.parse(localStorage.getItem("participated") ?? "[]")

      // memo: submit을 했다는건 안했다는거임. 한 사람은 이미 리디렉트 당함
      const obj = { postId, listId: selectedCandidate.listId }
      if (participated.length > 0) {
        if (!participated.find((v) => v === postId))
          localStorage.setItem("participated", JSON.stringify([...participated, obj]))
      } else {
        localStorage.setItem("participated", JSON.stringify([obj]))
      }
      setVotedId(obj)
    }
  }

  return (
    <>
      {selectedCandidate ? (
        <div key={selectedCandidate.listId} className="voting">
          <div
            style={{
              background: `url('${selectedCandidate.imageSrc}') center / cover`,
              ...scaleUpAnimation(250),
            }}
            className="voting-image"
          ></div>
          <div className="voting-description">
            <h2 style={fadeMoveUpAnimation(500, 100)}>{selectedCandidate.title}</h2>
            <p style={fadeMoveUpAnimation(510, 150)}>{selectedCandidate.description}</p>
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
