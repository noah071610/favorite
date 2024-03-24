"use client"

import { useMainStore } from "@/_store/main"
import { PostType } from "@/_types/post"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import dynamic from "next/dynamic"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const PollingPost = dynamic(() => import("@/[lang]/post/[postId]/_components/Polling"), {})
const ContestPost = dynamic(() => import("@/[lang]/post/[postId]/_components/Contest"), {})
const TournamentPost = dynamic(() => import("@/[lang]/post/[postId]/_components/Tournament"), {})

export default function Preview({
  previewPost,
  setIsOnPreview,
}: {
  previewPost: PostType
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
      {previewPost.type === "polling" && <PollingPost initialPost={previewPost} />}
      {previewPost.type === "contest" && <ContestPost initialPost={previewPost} />}
      {previewPost.type === "tournament" && <TournamentPost initialPost={previewPost} />}

      <div className={cx(style["preview-triangle"])}></div>
      <span className={cx(style["preview-label"])}>PREVIEW</span>
    </div>
  )
}
