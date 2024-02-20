"use client"

import CommentPart from "@/_components/CommentPart"
import FavoriteLoading from "@/_components/Loading/FavoriteLoading"
import PostInfo from "@/_components/PostInfo"
import { useGetVotedId } from "@/_hooks/useGetVotedId"
import { usePreloadImages } from "@/_hooks/usePreloadImages"
import { getPost } from "@/_queries/post"
import { usePostStore } from "@/_store/post"
import { PollingPostType } from "@/_types/post/post"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import Candidate from "./_components/Candidate"
import ChartPart from "./_components/ChartPart"
import SelectPart from "./_components/SelectPart"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function PostPage({ previewPost }: { previewPost?: PollingPostType }) {
  const router = useRouter()
  const { postId } = useParams<{ postId: string }>()
  const { isPreview, layoutType, isResultPage, setIsResultPage, setVotedId, resetStates, selectedCandidate } =
    usePostStore()

  const {
    isError,
    error,
    data: post,
  } = useQuery<PollingPostType>({
    queryKey: ["getPost", postId],
    queryFn: () => getPost(postId),
  })
  const isImagesLoaded = usePreloadImages(post ? post.content.candidates.map(({ imageSrc }) => imageSrc) : [])
  useGetVotedId(postId)

  const candidates = useMemo(() => {
    const target = post?.content.candidates ?? []
    return isResultPage ? [...target].sort((a, b) => b.count - a.count) : target
  }, [post, isResultPage])

  useEffect(() => {
    resetStates({ isPreview: !!previewPost, layoutType: post?.content.layout ?? null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post])

  useEffect(() => {
    if (isError) {
      alert((error as any).response.data.message)
      router.back()
    }
  }, [error, isError, router])

  const onClickSubmit = () => {
    if (selectedCandidate) {
      if (!isPreview) {
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
      setIsResultPage(true)
    }
  }

  return (
    <div className={cx(style["polling-post"], { [style["result"]]: isResultPage })}>
      {isPreview && (
        <div className={cx(style["preview-back"])}>
          <Link href="/post/new">
            <i className={cx("fa-solid", "fa-back")}></i>
          </Link>
        </div>
      )}
      {post && isImagesLoaded && layoutType ? (
        <div className={cx(style["polling-post-inner"])}>
          <PostInfo title={post.title} description={post.description} user={post.user} />
          <div
            className={cx(style.content, {
              [style[`layout-${layoutType}`]]: layoutType,
            })}
          >
            <div className={cx(style.left)}>
              <ul className={cx(style["candidate-list"])}>
                {candidates.map((candidate, index) => (
                  <Candidate
                    onClickSubmit={onClickSubmit}
                    candidate={candidate}
                    index={index}
                    key={`${candidate.listId}_${isResultPage ? "result" : "polling"}`}
                  />
                ))}
              </ul>
            </div>
            <div className={cx(style.right)}>
              {isResultPage ? (
                <div className={cx(style["right-inner"])}>
                  <div className={cx(style.title)}>
                    <div className={cx(style.icon)}>
                      <i className={cx("fa-solid", "fa-chart-simple")} />
                    </div>

                    <span>통계</span>
                  </div>
                  <ChartPart chartDescription={post.content.chartDescription} candidates={post.content.candidates} />
                  <div className={cx(style.title)}>
                    <div className={cx(style.icon)}>
                      <i className={cx("fa-solid", "fa-comment")} />
                    </div>
                    <span>코멘트</span>
                  </div>
                  <CommentPart post={post} />
                </div>
              ) : (
                <SelectPart onClickSubmit={onClickSubmit} />
              )}
            </div>
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
