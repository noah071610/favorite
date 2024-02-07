"use client"

import FavoriteLoading from "@/_components/Loading/FavoriteLoading"
import { getPost } from "@/_queries/post"
import { CandidateType, PostType, VoteIdType } from "@/_types/post"
import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Candidates from "./_components/Candidates"
import ChartPart from "./_components/Chartpart"
import CommentPart from "./_components/CommentPart"
import Voting from "./_components/Voting"
import "./style.scss"

export default function PostPageLayout() {
  const router = useRouter()
  const { postId } = useParams<{ postId: string }>()

  const {
    isError,
    error,
    data: post,
  } = useQuery<PostType>({
    queryKey: ["getPost"],
    queryFn: () => getPost(postId),
  })

  const [isImagesLoaded, setIsImagesLoaded] = useState(false)
  const [imageLoadedCount, setImageLoadedCount] = useState<number>(0)
  const [currentSection, setCurrentSection] = useState<"analytics" | "comments">("analytics")
  const [votedId, setVotedId] = useState<VoteIdType | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateType | null>(null)

  if (isError) {
    alert((error as any).response.data.message)
    router.back()
  } // memo: 리액트는 순수함수여야 하는데.. 이건 그냥 리디렉션이니까 뭐?

  const onClickNav = (type: "analytics" | "comments") => {
    setCurrentSection(type)
  }

  useEffect(() => {
    const participated: VoteIdType[] = JSON.parse(localStorage.getItem("participated") ?? "[]")
    const localVotedId = participated.find((v) => v.postId === postId)
    if (localVotedId) {
      setVotedId(localVotedId)
    }
  }, [postId])

  useEffect(() => {
    if (imageLoadedCount === post?.content.length) {
      // memo: 모든 이미지가 로드된 경우에 수행할 동작
      setTimeout(() => {
        setIsImagesLoaded(true)
      }, 1000)
    }
  }, [imageLoadedCount, post])

  useEffect(() => {
    const handleImageLoad = (image: HTMLImageElement) => {
      if (image.naturalHeight > 0) {
        setImageLoadedCount((n) => n + 1)
      }
    }

    const imageLoadHandlers =
      post &&
      post.content.map(({ imageSrc }) => {
        const image = new Image()

        image.src = imageSrc
        image.onload = () => handleImageLoad(image)
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
    <div className={classNames("post-wrapper", { "result-page": !!votedId })}>
      {post && isImagesLoaded ? (
        <div className="post">
          <div className="post-info">
            <div className="post-info-title">
              <h1>{post.title}</h1>
              <p>{post.description}</p>
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
          <div className={classNames("post-content", { "result-page": !!votedId })}>
            <div className="left">
              <Candidates
                candidates={post.content}
                isResultPage={!!votedId}
                selectedCandidate={selectedCandidate}
                setSelectedCandidate={setSelectedCandidate}
                votedListId={votedId?.listId}
              />
            </div>
            <div className="right">
              {votedId ? (
                <div className="result">
                  <div className="result-nav">
                    <button
                      className={classNames({ active: currentSection === "analytics" })}
                      onClick={() => onClickNav("analytics")}
                    >
                      통계
                    </button>
                    <button
                      className={classNames({ active: currentSection === "comments" })}
                      onClick={() => onClickNav("comments")}
                    >
                      코멘트
                    </button>
                    <div className={classNames("follower-div", {})}></div>
                  </div>
                  {currentSection === "analytics" ? <ChartPart /> : <CommentPart />}
                </div>
              ) : (
                <Voting setVotedId={setVotedId} selectedCandidate={selectedCandidate} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <FavoriteLoading />
      )}
    </div>
  )
}
