"use client"

import FavoriteLoading from "@/_components/Loading/FavoriteLoading"
import { getPost } from "@/_queries/post"
import { PollingLayoutType } from "@/_store/newPost"
import { CandidateType, PostType, VoteIdType } from "@/_types/post"
import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import Candidate from "./_components/@Polling/Candidate"
import ChartPart from "./_components/@Polling/Chartpart"
import SelectPart from "./_components/@Polling/SelectPart"
import CommentPart from "./_components/CommentPart"
import "./style.scss"

export default function PostPage({ previewPost }: { previewPost?: PostType }) {
  const router = useRouter()
  const { postId } = useParams<{ postId: string }>()
  console.log(previewPost)

  const {
    isError,
    error,
    data: post,
  } = !previewPost
    ? useQuery<PostType>({
        queryKey: ["getPost", postId],
        queryFn: () => getPost(postId),
      })
    : { isError: false, error: false, data: previewPost }

  const [isImagesLoaded, setIsImagesLoaded] = useState(false)
  const [imageLoadedCount, setImageLoadedCount] = useState<number>(0)
  const [votedId, setVotedId] = useState<VoteIdType | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateType | null>(null)
  const isResultPage = !!votedId

  useEffect(() => {
    if (isError) {
      alert((error as any).response.data.message)
      router.back()
    }
  }, [error, isError, router])

  const candidates = useMemo(() => {
    const target = post?.content.candidates ?? []
    return isResultPage ? [...target].sort((a, b) => b.count - a.count) : target
  }, [post?.content, isResultPage])

  const layoutType: PollingLayoutType | undefined = useMemo(() => {
    return post?.content?.layout
  }, [post])

  useEffect(() => {
    if (!previewPost && postId) {
      const participated: VoteIdType[] = JSON.parse(localStorage.getItem("participated") ?? "[]")
      const localVotedId = participated.find((v) => v.postId === postId)
      if (localVotedId) {
        setVotedId(localVotedId)
      }
    }
  }, [postId])

  useEffect(() => {
    if (imageLoadedCount === post?.content.candidates.length) {
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
      post.content.candidates.map(({ imageSrc }) => {
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
      if (!previewPost) {
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
      } else {
        //memo: preview
        setVotedId({ postId: "preview", listId: selectedCandidate.listId })
      }
    }
  }

  return (
    <div className={classNames("post-page", { isResultPage })}>
      {post && isImagesLoaded && layoutType ? (
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
          <div
            className={classNames("content", {
              textOnly: layoutType === "text" && !isResultPage,
              isResultPage,
              [layoutType]: layoutType,
              [post.type]: post.type,
            })}
          >
            <div className={classNames("left")}>
              <ul className="candidate-list">
                {candidates.map((candidate, index) => (
                  <Candidate
                    onClickSubmit={onClickSubmit}
                    isResultPage={isResultPage}
                    type={layoutType}
                    selectedCandidate={selectedCandidate}
                    setSelectedCandidate={setSelectedCandidate}
                    votedListId={votedId?.listId}
                    candidate={candidate}
                    index={index}
                    key={`${candidate.listId}_${isResultPage ? "result" : "polling"}`}
                  />
                ))}
              </ul>
            </div>
            <div className={classNames("right")}>
              {votedId ? (
                <div className="result">
                  <div className="title">
                    <div className="icon">
                      <i className="fa-solid fa-chart-simple" />
                    </div>

                    <span>통계</span>
                  </div>
                  <ChartPart candidates={post.content.candidates} />
                  <div className="title">
                    <div className="icon">
                      <i className="fa-solid fa-comment" />
                    </div>
                    <span>코멘트</span>
                  </div>
                  <CommentPart />
                </div>
              ) : (
                <SelectPart onClickSubmit={onClickSubmit} selectedCandidate={selectedCandidate} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <FavoriteLoading type="full" />
      )}
    </div>
  )
}
