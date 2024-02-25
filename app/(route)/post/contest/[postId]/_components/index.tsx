"use client"

import { ContestCandidateType, ContestContentType, ContestPostType } from "@/_types/post/contest"
import { useEffect, useState } from "react"
import ResultPart from "./ResultPart"

import CommentPart from "@/_components/CommentPart"
import FavoriteLoading from "@/_components/Loading/FavoriteLoading"
import PostInfo from "@/_components/PostInfo"
import { successMessage } from "@/_data/message"
import { successToastOptions } from "@/_data/toast"
import { checkVoted } from "@/_hooks/checkVoted"
import { setParticipate } from "@/_hooks/setParticipate"
import { usePreloadImages } from "@/_hooks/usePreloadImages"
import { TournamentCandidateType } from "@/_types/post/tournament"
import classNames from "classNames"
import { produce } from "immer"
import { toast } from "react-toastify"
import Candidate from "./Candidate"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ContestPost({ post }: { post: ContestPostType }) {
  const [status, setStatus] = useState<"init" | "result">("init")
  const [content, setContent] = useState<ContestContentType>(post.content)
  const [selected, setSelected] = useState<string | null>(null)
  const isImagesLoaded = usePreloadImages(content ? [content.left.imageSrc, content.right.imageSrc] : [])
  const isResultPage = status === "result"
  const isPreview = post.format === "preview"

  const isVoted =
    !isPreview &&
    checkVoted({
      candidates: [content.left, content.right],
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

  const swiped = (direction: "left" | "right", target: ContestCandidateType | TournamentCandidateType) => {
    setContent((content) => {
      return produce(content, (draft) => {
        if (draft) {
          // todo: api 요청시 옵티미스틱 유아이로
          draft[direction].count += 1
        }
      })
    })
    if (!isPreview) {
      setParticipate({ listId: content[direction].listId, postId: post.postId })
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
              {(["left", "right"] as Array<"left" | "right">).map((dr) => (
                <div key={dr} className={cx(style[dr])}>
                  {isResultPage ? (
                    <ResultPart selected={selected} content={content} direction={dr} />
                  ) : (
                    <Candidate candidate={content[dr]} swiped={swiped} direction={dr} />
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
                  <CommentPart comments={post.comments} />
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
