"use client"

import { useNewPostStore } from "@/_store/newPost"

import NoThumbnail from "@/_components/@Global/Loading/NoThumbnail"
import { uploadImage } from "@/_queries/newPost"
import { ThumbnailType } from "@/_types/post/post"
import { useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"

import { getImageUrl } from "@/_data"
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
  const { setNewPost, thumbnail, content, candidates, setThumbnail, setThumbnailLayout } = useNewPostStore()

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
    [setThumbnail]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
  })

  useEffect(() => {
    const reject = () => {
      setThumbnail({ type: "isPossibleLayout", payload: false })
      if (thumbnail.type === "layout") {
        setThumbnail({ type: "type", payload: "custom" })
      }
    }

    if (candidates.length < 2) return reject()
    if (content.layout === "text") return reject()
    if (!candidates.every(({ imageSrc }) => !!imageSrc?.trim())) return reject()

    setThumbnailLayout({ slice: thumbnail.slice })
    setThumbnail({ type: "isPossibleLayout", payload: true })
  }, [candidates, content.layout, setThumbnail, setThumbnailLayout, thumbnail.slice, thumbnail.type])

  return (
    <div className={cx(style["thumbnail-styler"])}>
      {thumbnail.type === "custom" && (
        <div
          style={{
            background: getImageUrl({ url: thumbnail.imageSrc, isCenter: true }),
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
                  backgroundImage: getImageUrl({ url: imageSrc }),
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
              disabled={type === "layout" ? !thumbnail.isPossibleLayout : false}
              onClick={() => onChangeThumbnailStyle(type as ThumbnailType)}
              className={cx(style.btn, { [style.active]: thumbnail.type === type })}
            >
              <div className={cx(style["preview-icon"])}>{children}</div>
              <span>{label}</span>
            </button>
            {thumbnail.isPossibleLayout && type === thumbnail.type && thumbnail.type === "layout" && (
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
