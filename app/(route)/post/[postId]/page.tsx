"use client"

import FavoriteLoading from "@/_components/Loading/FavoriteLoading"
import { getPost } from "@/_queries/post"
import { CandidateDisplayType } from "@/_store/newPost"
import { ListType, PostType, VoteIdType } from "@/_types/post"
import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import Candidate from "./_components/Candidate"
import ChartPart from "./_components/Chartpart"
import CommentPart from "./_components/CommentPart"
import VotingPart from "./_components/VotingPart"
import "./style.scss"

export default function PostPage() {
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
  const [votedId, setVotedId] = useState<VoteIdType | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<ListType | null>(null)
  const isResultPage = !!votedId

  useEffect(() => {
    if (isError) {
      alert((error as any).response.data.message)
      router.back()
    }
  }, [error, isError, router])

  const candidates = useMemo(() => {
    const target = post?.content ?? []
    return isResultPage ? [...target].sort((a, b) => b.count - a.count) : target
  }, [post?.content, isResultPage])

  const candidateType: CandidateDisplayType | null = useMemo(() => {
    return (post?.type.split("-")[1] as CandidateDisplayType) ?? null
  }, [post])

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
        if (imageSrc) {
          const image = new Image()

          image.src = imageSrc
          image.onload = () => handleImageLoad(image)
          image.onerror = () => {
            setImageLoadedCount((n) => n + 1)
          }
          return image
        } else {
          setImageLoadedCount((n) => n + 1)
        }
      })

    return () => {
      if (imageLoadHandlers) {
        setImageLoadedCount(0)
        imageLoadHandlers.forEach((image) => {
          if (image) {
            image.onload = null
            image.onerror = null
          }
        })
      }
    }
  }, [post])

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
    <div className={classNames("post-page", { isResultPage })}>
      {post && isImagesLoaded ? (
        <div className="post-page-inner">
          <div className="info">
            <div className={classNames("title")}>
              <h1>{post.title}</h1>
              {post.description.trim() && <h2>{post.description}</h2>}
            </div>
            <div className="profile">
              <button className="user-image">
                <img src={post.user.userImage} alt={`user_image_${post.user.userId}`} />
              </button>
              <div className="user-info">
                <span>{post.user.userName}</span>
                <span>2024/01/13</span>
              </div>
            </div>
          </div>
          <div className={classNames("content", { textOnly: candidateType === "text" && !isResultPage })}>
            <div className={classNames("left")}>
              <ul className="candidate-list">
                {candidates.map((candidate, index) => (
                  <Candidate
                    onClickSubmit={onClickSubmit}
                    isResultPage={isResultPage}
                    type={(post.type.split("-")[1] as CandidateDisplayType) ?? "textImage"}
                    selectedCandidate={selectedCandidate}
                    setSelectedCandidate={setSelectedCandidate}
                    votedListId={votedId?.listId}
                    candidate={candidate}
                    index={index}
                    key={`${candidate.listId}_${isResultPage ? "result" : "vote"}`}
                  />
                ))}
              </ul>
            </div>
            <div className={classNames("right")}>
              {votedId ? (
                <div className="result">
                  <div className="title">
                    <i className="fa-solid fa-chart-simple" />
                    <span>통계</span>
                  </div>
                  <ChartPart candidates={post.content} />
                  <div className="title">
                    <i className="fa-solid fa-comment" />
                    <span>코멘트</span>
                  </div>
                  <CommentPart />
                </div>
              ) : (
                <VotingPart onClickSubmit={onClickSubmit} selectedCandidate={selectedCandidate} />
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
