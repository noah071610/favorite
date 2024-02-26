"use client"

import { useNewPostStore } from "@/_store/newPost"

import NoThumbnail from "@/_components/Loading/NoThumbnail"
import { uploadImage } from "@/_queries/newPost"
import { useContestStore } from "@/_store/newPost/contest"
import { usePollingStore } from "@/_store/newPost/polling"
import { ThumbnailType } from "@/_types/post/post"
import { useCallback, useMemo } from "react"
import { useDropzone } from "react-dropzone"

import { useTournamentStore } from "@/_store/newPost/tournament"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const selectorTypes = [
  { type: "custom", children: <i className={cx("fa-solid", "fa-image")}></i>, label: "커스텀 썸네일" },
  {
    type: "layout",
    children: <i className={cx("fa-solid", "fa-film")}></i>,
    label: "콘텐츠 레이아웃",
  },
  { type: "none", children: <i className={cx("fa-solid", "fa-close")}></i>, label: "썸네일 없음" },
]

export default function ThumbnailStyle() {
  const { newPost, setNewPost } = useNewPostStore()
  const { contestContent } = useContestStore()
  const { tournamentContent } = useTournamentStore()
  const { pollingContent } = usePollingStore()

  const onChangeThumbnailStyle = (type: ThumbnailType) => {
    setNewPost({ type: "thumbnailType", payload: type })
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: any) => {
        const formData = new FormData()
        formData.append("image", file)

        const { msg, imageSrc } = await uploadImage(formData)
        if (msg === "ok") {
          setNewPost({ type: "thumbnail", payload: imageSrc })
          setNewPost({ type: "thumbnailType", payload: "custom" })
        }
      })
    },
    [setNewPost]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
  })

  const thumbnailType = newPost?.info.thumbnailType
  const layoutImages = useMemo(() => {
    switch (newPost?.type) {
      case "polling":
        return pollingContent.candidates.slice(0, 5)
      case "contest":
        return [contestContent.left, contestContent.right]
      case "tournament":
        return tournamentContent.candidates.slice(0, 5)
      default:
        return []
    }
  }, [
    contestContent.left,
    contestContent.right,
    newPost?.type,
    pollingContent.candidates,
    tournamentContent.candidates,
  ])

  return (
    <div className={cx(style["thumbnail-styler"])}>
      {thumbnailType === "custom" && (
        <div
          style={{
            background: `url('${newPost?.thumbnail}') center / cover`,
          }}
          className={cx(style.thumbnail, style.custom, { [style.active]: isDragActive })}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <i className={cx("fa-solid", "fa-plus", { [style.active]: isDragActive })} />
        </div>
      )}
      {thumbnailType === "layout" && (
        <div className={cx(style.thumbnail, style.layout)}>
          {layoutImages.slice(0, 5).map(({ listId, imageSrc }) => (
            <div
              key={`thumb_${listId}`}
              style={{
                backgroundImage: `url('${imageSrc}'), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDEOaqDXtUswwG_M29-z0hIYG-YQqUPBUidpFBHv6g60GgpYq2VQesjbpmVVu8kfd-pw&usqp=CAU')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </div>
      )}
      {thumbnailType === "none" && <NoThumbnail type="post-card" />}
      <div className={cx(style["thumbnail-selector"])}>
        {selectorTypes.map(({ type, children, label }) => (
          <button
            key={type}
            onClick={() => onChangeThumbnailStyle(type as ThumbnailType)}
            className={cx({ [style.active]: thumbnailType === type })}
          >
            <div className={cx(style["preview-icon"])}>{children}</div>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
