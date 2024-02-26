"use client"

import { ContestPostType } from "@/_types/post/contest"
import { PollingPostType } from "@/_types/post/polling"
import { TournamentPostType } from "@/_types/post/tournament"
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
  previewPost: PollingPostType | ContestPostType | TournamentPostType
  setIsOnPreview: (b: boolean) => void
}) {
  return (
    <div className={cx(style.preview, { [style.visible]: setIsOnPreview })}>
      <div className={cx(style["preview-back"])}>
        <button onClick={() => setIsOnPreview(false)}>
          <i className={cx("fa-solid", "fa-close")}></i>
        </button>
      </div>
      {previewPost.type === "polling" && <PollingPost post={previewPost as PollingPostType} />}
      {previewPost.type === "contest" && <ContestPost post={previewPost as ContestPostType} />}
      {previewPost.type === "tournament" && <TournamentPost post={previewPost as TournamentPostType} />}

      <div className={cx(style["preview-triangle"])}></div>
      <span className={cx(style["preview-label"])}>PREVIEW</span>
    </div>
  )
}
