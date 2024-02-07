"use client"

import { getPost } from "@/_queries/post"
import { PostType } from "@/_types/post"
import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import { useParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Candidates from "./_components/Candidates"
import Contents from "./_components/Contents"
import Result from "./result/page"
import "./style.scss"

export default function PostPageLayout() {
  const pathname = usePathname()
  const isResultPage = !!pathname.includes("result")
  const { postId } = useParams<{ postId: string }>()

  const { data: post } = useQuery<PostType>({
    queryKey: ["getPost"],
    queryFn: () => getPost(postId),
  })

  const [isImagesLoaded, setIsImagesLoaded] = useState(false)
  const [sourceLoadedArr, setSourceLoadedArr] = useState<number>(0)

  useEffect(() => {
    if (sourceLoadedArr === post?.content.length) {
      // 모든 이미지가 로드된 경우에 수행할 동작
      setIsImagesLoaded(true)
    }
  }, [sourceLoadedArr, post])

  const handleImageLoad = () => {
    setSourceLoadedArr((n) => n + 1)
  }

  useEffect(() => {
    const imageLoadHandlers =
      post &&
      post.content.map(({ imageSrc }) => {
        const image = new Image()
        image.src = imageSrc
        image.onload = handleImageLoad
        return image
      })

    return () => {
      if (imageLoadHandlers) {
        imageLoadHandlers.forEach((image) => {
          image.onload = null
          image.onerror = null
        })
      }
    }
  }, [post])

  return (
    <div className={classNames("post-wrapper", { isResultPage })}>
      {post && isImagesLoaded ? (
        <div className="post">
          <div className="post-info">
            <div className="post-info-title">
              <h1>귀멸의칼날에서 가장 강한 캐릭터 통계</h1>
              <p>당신이 생각하는 귀멸의칼날 원탑 칼잡이 싸무라이는?</p>
            </div>
            <div className="post-info-profile">
              <button className="user-image">
                <img src={post.user.userImage} alt={`user_image_${post.user.userId}`} />
              </button>
              <div>
                <h3>{post.user.userName}</h3>
                <span>작성일: 2024/01/13</span>
              </div>
            </div>
          </div>
          <div className={classNames("post-content", { "result-page": isResultPage })}>
            <div className="left">
              <Candidates candidates={post.content} isResultPage={isResultPage} />
            </div>
            <div className="right">{isResultPage ? <Result /> : <Contents />}</div>
          </div>
        </div>
      ) : (
        <div className="global-loading-wrapper">
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
  )
}
