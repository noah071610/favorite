"use client"

import { useProgressiveImageAll } from "@/_hooks/useProgressiveImageAll"
import { candidates, dummyPostCards } from "@/_utils/faker"
import classNames from "classnames"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Candidates from "./_components/Candidates"
import Contents from "./_components/Contents"
import Result from "./result/page"
import "./style.scss"

export default function PostPageLayout() {
  const {
    user: { userName, userImage, userId },
  } = dummyPostCards[0]

  const pathname = usePathname()
  const isResultPage = !!pathname.includes("result")

  const imagesLoaded = useProgressiveImageAll(candidates.map(({ imageSrc }) => imageSrc))
  const [loaded, setLoaded] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 4500)
  }, []) // todo: 단순 로딩, 지금은 true임. 나중에 쓸 수도..

  return (
    <div className="post-wrapper">
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
        <div className={classNames("post-content", { "result-page": isResultPage })}>
          {imagesLoaded && loaded ? (
            <>
              <div className="left">
                <Candidates isResultPage={isResultPage} />
              </div>
              <div className="right">{isResultPage ? <Result /> : <Contents />}</div>
            </>
          ) : (
            <div className="loading">
              <div className="global-loading">
                <div className="global-loading-inner">
                  <i className="global-loading-icon fa-solid fa-gift"></i>
                  <i className="global-loading-icon fa-solid fa-heart"></i>
                  <i className="global-loading-icon fa-solid fa-rocket"></i>
                </div>
                <span>Loading</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
