"use client"

import { ContestCandidateType, ContestPostType } from "@/_types/post/contest"
import { useEffect, useState } from "react"
import ResultPart from "./ResultPart"

import CommentPart from "@/_components/CommentPart"
import FavoriteLoading from "@/_components/Loading/FavoriteLoading"
import PostInfo from "@/_components/PostInfo"
import { successMessage } from "@/_data/message"
import { successToastOptions } from "@/_data/toast"
import { useCheckVoted } from "@/_hooks/useCheckVoted"
import { usePreloadImages } from "@/_hooks/usePreloadImages"
import { setParticipate } from "@/_hooks/useSetParticipate"
import { finishPlay } from "@/_queries/post"
import { TournamentCandidateType } from "@/_types/post/tournament"
import classNames from "classNames"
import { produce } from "immer"
import { toast } from "react-toastify"
import Candidate from "./Candidate"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ContestPost({ initialPost }: { initialPost: ContestPostType }) {
  const [post, setPost] = useState<ContestPostType>(initialPost)
  const candidates: ContestCandidateType[] = post.content.candidates

  const [status, setStatus] = useState<"init" | "result">("init")
  const [selected, setSelected] = useState<string | null>(null)
  const isImagesLoaded = usePreloadImages(candidates.map((v) => v.imageSrc))
  const isResultPage = status === "result"
  const isPreview = post.format === "preview"

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
      toast.success(successMessage["voted"], successToastOptions("voted"))
    }
  }, [isVoted, isImagesLoaded])

  const swiped = async (_direction: "left" | "right", target: ContestCandidateType | TournamentCandidateType) => {
    const direction = _direction === "left" ? 0 : 1
    setPost((post) => {
      return produce(post, (draft) => {
        draft.content.candidates[direction].pick += 1
      })
    })

    if (!isPreview) {
      await finishPlay(
        post.postId,
        produce(candidates, (draft) => {
          draft[direction].pick = draft[direction].pick + 1
        })
      )
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
        <div className={cx(["contest-post-inner"])}>
          <PostInfo title={post.title} description={post.description} user={post.user} />
          <div className={cx(style.content)}>
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
              <section className={cx(style["comment-section"])}>
                <div className={cx(style.title)}>
                  <div className={cx(style.icon)}>
                    <i className={cx("fa-solid", "fa-comment")} />
                  </div>
                  <span>코멘트</span>
                </div>
                <div className={cx(style["contest-comment"])}>
                  <CommentPart
                    setPost={setPost}
                    isPreview={post.format === "preview"}
                    authorId={post.user?.userId ?? 1}
                    comments={post.comments}
                  />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  ) : (
    <FavoriteLoading type="full" />
  )
}
