"use client"

import { useNewPostStore } from "@/_store/newPost"

import NoThumbnail from "@/_components/Loading/NoThumbnail"
import { uploadImage } from "@/_queries/newPost"
import { ThumbnailType } from "@/_types/post/post"
import { useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"

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
  const { newPost, setNewPost, thumbnail, candidates, setThumbnail, setThumbnailLayout } = useNewPostStore()

  const onChangeThumbnailStyle = (type: ThumbnailType) => {
    setThumbnail({ type: "type", payload: type })
  }
  const sliceThumbnailLayout = (v: -1 | 1) => {
    const slice = thumbnail.slice + v
    if (slice > 1 && slice <= 5) {
      setThumbnailLayout({ slice: thumbnail.slice + v })
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: any) => {
        const formData = new FormData()
        formData.append("image", file)

        const { msg, imageSrc } = await uploadImage(formData)
        if (msg === "ok") {
          setThumbnail({ type: `imageSrc`, payload: imageSrc })
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

  useEffect(() => {
    if (candidates.length > 1) {
      setThumbnailLayout({ slice: thumbnail.slice })
    } else {
      setThumbnailLayout({ slice: 0 })
    }
  }, [candidates])

  return (
    <div className={cx(style["thumbnail-styler"])}>
      {thumbnail.type === "custom" && (
        <div
          style={{
            background: `url('${thumbnail.imageSrc}') center / cover`,
          }}
          className={cx(style.thumbnail, style.custom, { [style.active]: isDragActive })}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <i className={cx("fa-solid", "fa-plus", { [style.active]: isDragActive })} />
        </div>
      )}
      {thumbnail.type === "layout" &&
        (candidates.length > 1 ? (
          <div className={cx(style.thumbnail, style.layout)}>
            {thumbnail.layout.map((imageSrc, i) => (
              <div
                key={`thumb_layout_${i}`}
                style={{
                  backgroundImage: `url('${imageSrc}'), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDEOaqDXtUswwG_M29-z0hIYG-YQqUPBUidpFBHv6g60GgpYq2VQesjbpmVVu8kfd-pw&usqp=CAU')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </div>
        ) : (
          <div className={cx(style["no-layout"])}>
            <span>2개 이상 후보 필요</span>
          </div>
        ))}
      {thumbnail.type === "none" && (
        <div className={cx(style["no-thumbnail"])}>
          <NoThumbnail type="post-card" />
        </div>
      )}
      <div className={cx(style["thumbnail-selector"])}>
        {selectorTypes.map(({ type, children, label }) => (
          <div key={type}>
            <button
              onClick={() => onChangeThumbnailStyle(type as ThumbnailType)}
              className={cx(style.btn, { [style.active]: thumbnail.type === type })}
            >
              <div className={cx(style["preview-icon"])}>{children}</div>
              <span>{label}</span>
            </button>
            {thumbnail.slice > 1 && type === thumbnail.type && thumbnail.type === "layout" && (
              <div className={cx(style["layout-customize"])}>
                <div className={cx(style.slice)}>
                  <button onClick={() => sliceThumbnailLayout(-1)} disabled={thumbnail.slice <= 2}>
                    <i className={cx("fa-solid", "fa-chevron-left")}></i>
                  </button>
                  <span>{thumbnail.slice}</span>
                  <button
                    onClick={() => sliceThumbnailLayout(1)}
                    disabled={thumbnail.slice >= candidates.length || thumbnail.slice >= 5}
                  >
                    <i className={cx("fa-solid", "fa-chevron-right")}></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
