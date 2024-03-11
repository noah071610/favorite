"use client"

import FavoriteLoading from "@/_components/@Global/Loading/FavoriteLoading"
import Candidate from "@/_components/Candidate"
import CommentPart from "@/_components/CommentPart"
import PostInfo from "@/_components/PostInfo"
import Share from "@/_components/Share"
import { queryKey } from "@/_data"
import { toastSuccess } from "@/_data/toast"
import { usePlayMutation } from "@/_hooks/mutations/usePlayMutation"
import { useCheckVoted } from "@/_hooks/useCheckVoted"
import { usePreloadImages } from "@/_hooks/usePreloadImages"
import { setParticipate } from "@/_hooks/useSetParticipate"
import { useMainStore } from "@/_store/main"
import { PollingCandidateType, PollingPostType } from "@/_types/post/polling"
import { faChartSimple, faComment } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import { cloneDeep } from "lodash"
import { MouseEvent, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import ChartPart from "./Chartpart"
import SelectPart from "./SelectPart"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const PollingPost = ({ initialPost }: { initialPost: PollingPostType }) => {
  const { t } = useTranslation(["content"])
  const { t: message } = useTranslation(["messages"])
  const { data: post } = useQuery<PollingPostType>({
    queryKey: queryKey.post(initialPost.postId),
    initialData: initialPost,
  })
  const { windowSize } = useMainStore()
  const [onSelectModal, setOnSelectModal] = useState(false)

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
  const { mutate } = usePlayMutation(post.postId)

  useEffect(() => {
    if (isVoted && isImagesLoaded) {
      toastSuccess(message("success.voted"))
    }
  }, [isVoted, isImagesLoaded, message])

  const candidates = useMemo(() => {
    const target = post.content.candidates
    return isResultPage ? [...target].sort((a, b) => b.pick - a.pick) : target
  }, [isResultPage, post])

  const onClickCandidate = async (type: "submit" | "select", candidate?: PollingCandidateType) => {
    if (!isResultPage) {
      if (type === "submit" && selectedCandidate) {
        const finishedPost = cloneDeep({
          ...post,
          count: post.count + 1,
          content: {
            ...post.content,
            candidates: candidates.map((v) => (selectedCandidate.listId === v.listId ? { ...v, pick: v.pick + 1 } : v)),
          },
        })
        if (!isPreview) {
          mutate(finishedPost)
          setParticipate({ listId: selectedCandidate.listId, postId: post.postId })
        }
        setStatus("result")
        setOnSelectModal(false)
      }
      if (type === "select" && candidate) {
        setSelectedCandidate(candidate)
        if ((windowSize === "mobile" || windowSize === "medium") && post.content.layout !== "text") {
          setOnSelectModal(true)
        }
      }
    }
  }

  const onClickOverlay = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.className.includes("overlay")) {
      setOnSelectModal(false)
    }
  }

  return isImagesLoaded ? (
    <div className={cx(style["polling-post"], { [style["result"]]: isResultPage })}>
      {onSelectModal && <div onClick={onClickOverlay} className={cx(style.overlay)} />}
      <div className={cx(style["polling-post-inner"])}>
        <PostInfo title={post.title} description={post.description} user={post.user} />
        <div
          className={cx(style.content, {
            [style[`layout-${post.content.layout}`]]: post.content.layout,
            [style["result"]]: isResultPage,
          })}
        >
          <div className={cx(style.left)}>
            <ul className={cx(style["candidate-list"])}>
              {candidates.map((candidate, index) => (
                <div className={cx(style.list)} key={`${candidate.listId}_${status}`}>
                  <Candidate
                    onClickCandidate={onClickCandidate}
                    candidate={candidate}
                    index={index}
                    layout={post.content.layout}
                    isResultPage={isResultPage}
                    isSelected={selectedCandidate?.listId === candidate.listId}
                  />
                </div>
              ))}
            </ul>
          </div>
          <div className={cx(style.right, { [style["result"]]: isResultPage })}>
            {isResultPage ? (
              <div className={cx(style["right-inner"])}>
                <div className={cx(style.title)}>
                  <div className={cx(style.icon)}>
                    <FontAwesomeIcon icon={faChartSimple} />
                  </div>

                  <span>{t("analytic")}</span>
                </div>
                <ChartPart chartDescription={post.content.chartDescription} candidates={post.content.candidates} />
                <div className={cx(style.title)}>
                  <div className={cx(style.icon)}>
                    <FontAwesomeIcon icon={faComment} />
                  </div>
                  <span>{t("comment")}</span>
                </div>
                <div className={cx(style["comment-wrapper"])}>
                  <CommentPart
                    isPreview={post.format === "preview"}
                    authorId={post.user?.userId ?? 1}
                    comments={post.comments}
                  />
                </div>
                {!isPreview && <Share post={post} />}
              </div>
            ) : (
              <SelectPart selectedCandidate={selectedCandidate} onClickCandidate={onClickCandidate} />
            )}
          </div>
        </div>
      </div>
      {post.content.layout !== "text" && (
        <div className="global-medium-visible">
          <SelectPart
            onSelectModal={onSelectModal}
            isMobile={true}
            selectedCandidate={selectedCandidate}
            onClickCandidate={onClickCandidate}
          />
        </div>
      )}
    </div>
  ) : (
    <FavoriteLoading type="content" text="Image Loading" />
  )
}

export default PollingPost
