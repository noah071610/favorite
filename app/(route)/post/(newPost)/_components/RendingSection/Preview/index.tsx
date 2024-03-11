"use client"

import { useMainStore } from "@/_store/main"
import { ContestPostType } from "@/_types/post/contest"
import { PollingPostType } from "@/_types/post/polling"
import { TournamentPostType } from "@/_types/post/tournament"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import dynamic from "next/dynamic"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const PollingPost = dynamic(() => import("@/(route)/post/polling/[postId]/_components"), {})
const ContestPost = dynamic(() => import("@/(route)/post/contest/[postId]/_components"), {})
const TournamentPost = dynamic(() => import("@/(route)/post/tournament/[postId]/_components"), {})

export default function Preview({
  previewPost,
  setIsOnPreview,
}: {
  previewPost: any
  setIsOnPreview: (b: boolean) => void
}) {
  const { setModal } = useMainStore()
  const onClickClosePreview = () => {
    setIsOnPreview(false)
    setModal("none")
  }
  return (
    <div className={cx(style.preview, { [style.visible]: setIsOnPreview })}>
      <div className={cx(style["preview-back"])}>
        <button onClick={onClickClosePreview}>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
      {previewPost.type === "polling" && <PollingPost initialPost={previewPost as PollingPostType} />}
      {previewPost.type === "contest" && <ContestPost initialPost={previewPost as ContestPostType} />}
      {previewPost.type === "tournament" && <TournamentPost initialPost={previewPost as TournamentPostType} />}

      <div className={cx(style["preview-triangle"])}></div>
      <span className={cx(style["preview-label"])}>PREVIEW</span>
    </div>
  )
}
