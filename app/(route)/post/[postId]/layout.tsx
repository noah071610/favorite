"use client"

"use client"

import { dummyContentCards } from "@/_utils/faker"
import "./style.scss"

export default function PostPageLayout({
  children,
  candidates,
  contents,
}: Readonly<{
  children: React.ReactNode
  candidates: React.ReactNode
  contents: React.ReactNode
}>) {
  const {
    user: { userName, userImage, userId },
  } = dummyContentCards[0]

  return (
    <main className="post-wrapper">
      <div className="post">
        <div className="post-info">
          <div className="post-info-title">
            <h1>귀멸의칼날에서 가장 강한 캐릭터 통계</h1>
            <p>당신이 생각하는 귀멸의칼날 원탑 칼잡이 싸무라이는?</p>
          </div>
          <div className="post-info-profile">
            <button className="user-image">
              <img src={userImage} alt={`user_image_${userId}`} />
            </button>
            <div>
              <h3>{userName}</h3>
              <span>작성일: 2024/01/13</span>
            </div>
          </div>
        </div>
        <div className="post-content">
          <div className="left">{candidates}</div>
          <div className="right">{contents}</div>
        </div>
      </div>
    </main>
  )
}
