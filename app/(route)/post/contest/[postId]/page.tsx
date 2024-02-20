"use client"

import FavoriteLoading from "@/_components/Loading/FavoriteLoading"
import { getPost } from "@/_queries/post"
import { usePostStore } from "@/_store/post"
import { ContestContentType, ContestPostType } from "@/_types/post/post"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ResultPart from "./_components/ResultPart"
import SelectPart from "./_components/SelectPart"

import CommentPart from "@/_components/CommentPart"
import PostInfo from "@/_components/PostInfo"
import { useGetVotedId } from "@/_hooks/useGetVotedId"
import { usePreloadImages } from "@/_hooks/usePreloadImages"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ContestPostPage({ previewPost }: { previewPost?: ContestPostType }) {
  const router = useRouter()
  const { postId } = useParams<{ postId: string }>()
  const { isPreview, isResultPage, resetStates } = usePostStore()

  const {
    isError,
    error,
    data: post,
  } = useQuery<ContestPostType>({
    queryKey: ["getPost", postId],
    queryFn: () => getPost(postId),
  })
  const [content, setContent] = useState<ContestContentType | null>(null)
  const [selected, setSelected] = useState<"left" | "right" | null>(null)
  const isImagesLoaded = usePreloadImages(content ? [content.left.imageSrc, content.right.imageSrc] : [])
  useGetVotedId(postId)

  useEffect(() => {
    if (post) {
      setContent({ left: post.content.left, right: post.content.right })
      resetStates({ isPreview: !!previewPost, layoutType: null })
    }
  }, [post, previewPost, resetStates])

  useEffect(() => {
    if (isError) {
      alert((error as any).response.data.message)
      router.back()
    }
  }, [error, isError, router])

  return (
    <div className={cx(style["contest-post"], { [style.result]: isResultPage })}>
      {post && content && isImagesLoaded ? (
        <div className={cx(["contest-post-inner"])}>
          <PostInfo title={post.title} description={post.description} user={post.user} />
          <div className={cx(style.content, { [style.result]: isResultPage })}>
            {(["left", "right"] as Array<"left" | "right">).map((dr) => (
              <div key={dr} className={cx(style[dr])}>
                {isResultPage ? (
                  <ResultPart selected={selected} content={content} direction={dr} />
                ) : (
                  <SelectPart
                    selected={selected}
                    setSelected={setSelected}
                    content={content}
                    setContent={setContent}
                    direction={dr}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <FavoriteLoading type="full" />
      )}
      {post && isResultPage && (
        <div className={cx(style["contest-comment"])}>
          <CommentPart post={post} />
        </div>
      )}
    </div>
  )
}
