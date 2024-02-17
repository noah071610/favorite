"use client"

import FavoriteLoading from "@/_components/Loading/FavoriteLoading"
import { getPost } from "@/_queries/post"
import { usePostStore } from "@/_store/post"
import { ContestContentType, ContestPostType, VoteIdType } from "@/_types/post/post"
import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ResultPart from "./_components/ResultPart"
import SelectPart from "./_components/SelectPart"
import "./style.scss"

export default function ContestPostPage({ previewPost }: { previewPost?: ContestPostType }) {
  const router = useRouter()
  const { postId } = useParams<{ postId: string }>()
  const { isPreview, isResultPage, setIsResultPage, setVotedId, resetStates } = usePostStore()

  const {
    isError,
    error,
    data: post,
  } = !isPreview
    ? useQuery<ContestPostType>({
        queryKey: ["getPost", postId],
        queryFn: () => getPost(postId),
      })
    : { isError: false, error: false, data: previewPost }
  const [content, setContent] = useState<ContestContentType | null>(null)
  const [selected, setSelected] = useState<"left" | "right" | null>(null)

  useEffect(() => {
    if (post) {
      setContent({ left: post.content.left, right: post.content.right })
      resetStates({ isPreview: !!previewPost, layoutType: null })
    }
  }, [post])

  const [isImagesLoaded, setIsImagesLoaded] = useState(false)
  const [imageLoadedCount, setImageLoadedCount] = useState<number>(0)

  useEffect(() => {
    if (isError) {
      alert((error as any).response.data.message)
      router.back()
    }
  }, [error, isError, router])

  useEffect(() => {
    if (!isPreview && postId) {
      const participated: VoteIdType[] = JSON.parse(localStorage.getItem("participated") ?? "[]")
      const localVotedId = participated.find((v) => v.postId === postId)
      if (localVotedId) {
        setIsResultPage(true)
        setVotedId(localVotedId)
      }
    }
  }, [postId])

  useEffect(() => {
    if (imageLoadedCount === 2) {
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
      content &&
      [content.left.imageSrc, content.right.imageSrc].map((imageSrc) => {
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
  }, [content])

  return (
    <div className={classNames("post-page", "contest", { isResultPage })}>
      {isPreview && (
        <div className="preview-back">
          <Link href="/post/new">
            <i className="fa-solid fa-back"></i>
          </Link>
        </div>
      )}
      {post && content && isImagesLoaded ? (
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
          <div className={classNames("content", "contest")}>
            {(["left", "right"] as Array<"left" | "right">).map((dr) => (
              <div key={dr} className={dr}>
                {isResultPage ? (
                  <ResultPart selected={selected} content={content} direction={dr} />
                ) : (
                  <SelectPart setSelected={setSelected} content={content} setContent={setContent} direction={dr} />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <FavoriteLoading type="full" />
      )}
      {isPreview && (
        <div className="preview-notification">
          <span>PREVIEW</span>
        </div>
      )}
    </div>
  )
}
