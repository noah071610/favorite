"use client"

import FavoriteLoading from "@/_components/Loading/FavoriteLoading"
import { getPost } from "@/_queries/post"
import { usePostStore } from "@/_store/post"
import { TournamentPostType } from "@/_types/post/tournament"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import ResultPart from "./_components/ResultPart"
import SelectPart from "./_components/SelectPart"

import CommentPart from "@/_components/CommentPart"
import PostInfo from "@/_components/PostInfo"
import { useGetVotedId } from "@/_hooks/useGetVotedId"
import { usePreloadImages } from "@/_hooks/usePreloadImages"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function TournamentPostPage({ previewPost }: { previewPost?: TournamentPostType }) {
  const router = useRouter()
  const { postId } = useParams<{ postId: string }>()
  const { isPreview, isResultPage, resetStates } = usePostStore()

  const { isError, error, data } = useQuery<TournamentPostType>({
    queryKey: ["getPost", postId],
    queryFn: previewPost ? async () => ({ data: null }) : () => getPost(postId),
  })
  const post = previewPost ? previewPost : data

  const isImagesLoaded = usePreloadImages(
    post?.content.candidates ? post?.content.candidates.map(({ imageSrc }) => imageSrc) : []
  )
  useGetVotedId(postId)

  useEffect(() => {
    if (post) {
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
    <div className={cx(style["tournament-post"], { [style.result]: isResultPage })}>
      {post && candidates && isImagesLoaded ? (
        <div className={cx(["tournament-post-inner"])}>
          <PostInfo title={post.title} description={post.description} user={post.user} />
          <div className={cx(style.content, { [style.result]: isResultPage })}>
            {(["left", "right"] as Array<"left" | "right">).map((dr) => (
              <div key={dr} className={cx(style[dr])}>
                {isResultPage ? (
                  <ResultPart selected={selected} content={content} direction={dr} />
                ) : (
                  <SelectPart initialCandidates={post.content.candidates} />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <FavoriteLoading type="full" />
      )}
      {post && isResultPage && (
        <div className={cx(style["tournament-comment"])}>
          <CommentPart post={post} />
        </div>
      )}
    </div>
  )
}
