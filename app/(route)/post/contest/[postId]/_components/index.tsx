"use client"

import { ContestCandidateType, ContestPostType } from "@/_types/post/contest"
import { useEffect, useState } from "react"
import ResultPart from "./ResultPart"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import CommentPart from "@/_components/CommentPart"
import PostInfo from "@/_components/PostInfo"
import Candidate from "@/_components/Select"
import Share from "@/_components/Share"
import { queryKey } from "@/_data"
import { toastSuccess } from "@/_data/toast"
import { usePlayMutation } from "@/_hooks/mutations/usePlayMutation"
import { useCheckVoted } from "@/_hooks/useCheckVoted"
import { usePreloadImages } from "@/_hooks/usePreloadImages"
import { setParticipate } from "@/_hooks/useSetParticipate"
import { TournamentCandidateType } from "@/_types/post/tournament"
import { faComment } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import { cloneDeep } from "lodash"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ContestPost({ initialPost }: { initialPost: ContestPostType }) {
  const { t } = useTranslation(["content"])
  const { t: message } = useTranslation(["messages"])

  const { data: post } = useQuery<ContestPostType>({
    queryKey: queryKey.post(initialPost.postId),
    initialData: initialPost,
  })
  const candidates: ContestCandidateType[] = post.content.candidates

  const [status, setStatus] = useState<"init" | "result">("init")
  const [selected, setSelected] = useState<string | null>(null)
  const isImagesLoaded = usePreloadImages(candidates.map((v) => v.imageSrc))
  const isResultPage = status === "result"
  const isPreview = post.format === "preview"
  const { mutate } = usePlayMutation(post.postId)

  const isVoted = useCheckVoted({
    disable: isPreview,
    candidates,
    postId: post.postId,
    resolve: (target) => {
      setStatus("result")
      setSelected(target.listId)
    },
  })

  useEffect(() => {
    if (isVoted && isImagesLoaded) {
      toastSuccess(message("success.voted"))
    }
  }, [isVoted, isImagesLoaded])

  const swiped = async (_direction: "left" | "right", target: ContestCandidateType | TournamentCandidateType) => {
    const direction = _direction === "left" ? 0 : 1
    const finishedPost = cloneDeep({
      ...post,
      count: post.count + 1,
      content: {
        ...post.content,
        candidates: candidates.map((v, i) => (direction === i ? { ...v, pick: v.pick + 1 } : v)),
      },
    })

    if (!isPreview) {
      mutate(finishedPost)
      setParticipate({ listId: candidates[direction].listId, postId: post.postId })
    }
    setSelected(target.listId)
    setTimeout(() => {
      setStatus("result")
    }, 700)
  }

  return isImagesLoaded ? (
    <>
      <div className={cx(style["contest-post"], { [style.result]: isResultPage })}>
        <div className={cx(style["contest-post-inner"])}>
          <PostInfo title={post.title} description={post.description} user={post.user} />
          <div className={cx(style.content, { [style.result]: isResultPage })}>
            <section className={cx(style.candidates)}>
              {(["left", "right"] as Array<"left" | "right">).map((dr, i) => (
                <div key={dr} className={cx(style[dr])}>
                  {isResultPage ? (
                    <ResultPart selected={selected} candidates={candidates} direction={dr} />
                  ) : (
                    <Candidate candidate={candidates[i]} swiped={swiped} direction={dr} />
                  )}
                </div>
              ))}
            </section>

            {isResultPage && (
              <>
                <section className={cx(style["comment-section"])}>
                  <div className={cx(style.title)}>
                    <div className={cx(style.icon)}>
                      <FontAwesomeIcon icon={faComment} />
                    </div>
                    <span>{t("comment")}</span>
                  </div>
                  <div className={cx(style["contest-comment"])}>
                    <CommentPart
                      isPreview={post.format === "preview"}
                      authorId={post.user?.userId ?? 1}
                      comments={post.comments}
                    />
                  </div>
                </section>

                {!isPreview && <Share post={post} />}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  ) : (
    <FavoriteLoading type="content" text="Image Loading" />
  )
}
