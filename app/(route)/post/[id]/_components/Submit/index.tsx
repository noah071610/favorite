"use client"
import Link from "next/link"

import "./style.scss"

export default function Submit({ postId, selectedCandidate }: { postId: string; selectedCandidate: any }) {
  return (
    <div key={selectedCandidate.listId} className="submit">
      <div
        style={{
          background: `url('${selectedCandidate.image_src}') center / cover`,
          animation: "scale-up 250ms ease-out forwards",
        }}
        className="submit-image"
      ></div>
      <div className="submit-description">
        <h2
          style={{
            animation: "fade-move-up 500ms 100ms cubic-bezier(0,1.1,.78,1) forwards",
          }}
        >
          {selectedCandidate.title}
        </h2>
        <p
          style={{
            animation: "fade-move-up 510ms 150ms cubic-bezier(0,1.1,.78,1) forwards",
          }}
        >
          {selectedCandidate.description}
        </p>
      </div>
      <div className="submit-btn">
        <Link
          style={{
            animation: "fade-move-up 530ms 210ms cubic-bezier(0,1.1,.78,1) forwards",
          }}
          href={`/post/${postId}?result=${selectedCandidate.listId}`}
        >
          <span>{selectedCandidate.title} 선택</span>
        </Link>
      </div>
    </div>
  )
}
