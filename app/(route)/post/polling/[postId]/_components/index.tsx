"use client"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import CommentPart from "@/_components/CommentPart"
import PostInfo from "@/_components/PostInfo"
import { toastSuccess } from "@/_data/toast"
import { useCheckVoted } from "@/_hooks/useCheckVoted"
import { usePreloadImages } from "@/_hooks/usePreloadImages"
import { setParticipate } from "@/_hooks/useSetParticipate"
import { finishPlay } from "@/_queries/post"
import { PollingCandidateType, PollingPostType } from "@/_types/post/polling"
import classNames from "classNames"
import { produce } from "immer"
import { useEffect, useMemo, useState } from "react"
import Candidate from "./Candidate"
import ChartPart from "./ChartPart"
import SelectPart from "./SelectPart"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const PollingPost = ({ initialPost }: { initialPost: PollingPostType }) => {
  const [post, setPost] = useState<PollingPostType>(initialPost)

  const [status, setStatus] = useState<"init" | "result">("init")
  const [selectedCandidate, setSelectedCandidate] = useState<PollingCandidateType | null>(null)

  const isPreview = post.format === "preview"
  const isImagesLoaded = usePreloadImages(post.content.candidates.map(({ imageSrc }) => imageSrc))
  const isResultPage = status === "result"
  const isVoted = useCheckVoted({
    disable: isPreview,
    candidates: post.content.candidates,
    postId: post.postId,
    resolve: (target) => {
      setStatus("result")
      setSelectedCandidate(target)
    },
  })

  useEffect(() => {
    if (isVoted && isImagesLoaded) {
      toastSuccess("voted")
    }
  }, [isVoted, isImagesLoaded])

  const candidates = useMemo(() => {
    const target = post.content.candidates
    return isResultPage ? [...target].sort((a, b) => b.pick - a.pick) : target
  }, [isResultPage, post])

  const onClickCandidate = async (type: "submit" | "select", candidate?: PollingCandidateType) => {
    if (!isResultPage) {
      if (type === "submit" && selectedCandidate) {
        const postAfterSelected = produce(post, (draft) => {
          const target = draft.content.candidates.find((v) => v.listId === selectedCandidate.listId)
          if (target) {
            target.pick = target.pick + 1
          }
        })
        if (!isPreview) {
          await finishPlay(post.postId, postAfterSelected.content)
          setParticipate({ listId: selectedCandidate.listId, postId: post.postId })
        }
        setPost(postAfterSelected)
        setStatus("result")
      }
      if (type === "select" && candidate) {
        setSelectedCandidate(candidate)
      }
    }
  }

  return isImagesLoaded ? (
    <div className={cx(style["polling-post"], { [style["result"]]: isResultPage })}>
      <div className={cx(style["polling-post-inner"])}>
        <PostInfo title={post.title} description={post.description} user={post.user} />
        <div
          className={cx(style.content, {
            [style[`layout-${post.content.layout}`]]: post.content.layout,
          })}
        >
          <div className={cx(style.left)}>
            <ul className={cx(style["candidate-list"])}>
              {candidates.map((candidate, index) => (
                <Candidate
                  onClickCandidate={onClickCandidate}
                  candidate={candidate}
                  index={index}
                  layout={post.content.layout}
                  key={`${candidate.listId}_${status}`}
                  isResultPage={isResultPage}
                  isSelected={selectedCandidate?.listId === candidate.listId}
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
                <div className={cx(style["comment-wrapper"])}>
                  <CommentPart
                    setPost={setPost}
                    isPreview={post.format === "preview"}
                    authorId={post.user?.userId ?? 1}
                    comments={post.comments}
                  />
                </div>
              </div>
            ) : (
              <SelectPart selectedCandidate={selectedCandidate} onClickCandidate={onClickCandidate} />
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <FavoriteLoading type="full" text="Image Loading" />
  )
}

export default PollingPost
