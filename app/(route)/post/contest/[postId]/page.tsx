"use client"

import FavoriteLoading from "@/_components/Loading/FavoriteLoading"
import { getPost } from "@/_queries/post"
import { usePostStore } from "@/_store/post"
import { ContestContentType, ContestPostType } from "@/_types/post/post"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ResultPart from "./_components/ResultPart"
import SelectPart from "./_components/SelectPart"

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
  } = !isPreview
    ? useQuery<ContestPostType>({
        queryKey: ["getPost", postId],
        queryFn: () => getPost(postId),
      })
    : { isError: false, error: false, data: previewPost }
  const [content, setContent] = useState<ContestContentType | null>(null)
  const [selected, setSelected] = useState<"left" | "right" | null>(null)
  const isImagesLoaded = usePreloadImages(content ? [content.left.imageSrc, content.right.imageSrc] : [])
  useGetVotedId(postId)

  useEffect(() => {
    if (post) {
      setContent({ left: post.content.left, right: post.content.right })
      resetStates({ isPreview: !!previewPost, layoutType: null })
    }
  }, [post])

  useEffect(() => {
    if (isError) {
      alert((error as any).response.data.message)
      router.back()
    }
  }, [error, isError, router])

  return (
    <div className={cx(style["contest-post"])}>
      {isPreview && (
        <div className={cx(style["preview-back"])}>
          <Link href="/post/new">
            <i className={cx("fa-solid", "fa-back")}></i>
          </Link>
        </div>
      )}
      {post && content && isImagesLoaded ? (
        <div className={cx(["contest-post-inner"])}>
          <PostInfo post={post} />
          <div className={cx(style.content, { [style.result]: isResultPage })}>
            {(["left", "right"] as Array<"left" | "right">).map((dr) => (
              <div key={dr} className={cx(style[dr])}>
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
        <div className={cx(style["preview-notification"])}>
          <span>PREVIEW</span>
        </div>
      )}
    </div>
  )
}
