"use client"

import { useNewPostStore } from "@/_store/newPost"

import NoThumbnail from "@/_components/@Global/Loading/NoThumbnail"
import { uploadImage } from "@/_queries/newPost"
import { ThumbnailType } from "@/_types/post"
import { useTranslation } from "@/i18n/client"
import { useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"

import { getImageUrl } from "@/_data"
import { faChevronLeft, faChevronRight, faClose, faFilm, faImage, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useParams } from "next/navigation"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const selectorTypes = [
  { type: "custom", children: <FontAwesomeIcon icon={faImage} />, label: "thumbnailType.custom" },
  {
    type: "layout",
    children: <FontAwesomeIcon icon={faFilm} />,
    label: "thumbnailType.layout",
  },
  { type: "none", children: <FontAwesomeIcon icon={faClose} />, label: "thumbnailType.none" },
]

export default function ThumbnailStyle() {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])
  const {
    content: { candidates, thumbnail, layout },
    setThumbnail,
    setThumbnailLayout,
  } = useNewPostStore()

  const onChangeThumbnailStyle = (type: ThumbnailType) => {
    setThumbnail({ type: "type", payload: type })
  }
  const sliceThumbnailLayout = (v: -1 | 1) => {
    const slice = thumbnail.slice + v
    if (slice > 1 && slice <= 5) {
      setThumbnailLayout({ slice: thumbnail.slice + v, isSetThumbnail: true })
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: any) => {
        const formData = new FormData()
        formData.append("image", file)

        const { msg, data: imageSrc } = await uploadImage(formData)
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
    maxSize: 8000000,
  })

  useEffect(() => {
    const reject = () => {
      setThumbnail({ type: "isPossibleLayout", payload: false })
      if (thumbnail.type === "layout") {
        setThumbnail({ type: "type", payload: "custom" })
      }
    }

    if (candidates.length < 2) return reject()
    if (layout === "text") return reject()
    if (!candidates.every(({ imageSrc }) => !!imageSrc?.trim())) return reject()

    setThumbnailLayout({ slice: thumbnail.slice === 0 ? 2 : thumbnail.slice })
    setThumbnail({ type: "isPossibleLayout", payload: true })
  }, [candidates, layout, setThumbnail, setThumbnailLayout, thumbnail.slice, thumbnail.type])

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
          <FontAwesomeIcon className={cx({ [style.active]: isDragActive })} icon={faPlus} />
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
            <span>{t("moreThanTwoThumb")}</span>
          </div>
        ))}
      {thumbnail.type === "none" && (
        <div className={cx(style["no-thumbnail"])}>
          <NoThumbnail height={150} type="post-card" />
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
              <span>{t(label)}</span>
            </button>
            {thumbnail.isPossibleLayout && type === thumbnail.type && thumbnail.type === "layout" && (
              <div className={cx(style["layout-customize"])}>
                <div className={cx(style.slice)}>
                  <button onClick={() => sliceThumbnailLayout(-1)} disabled={thumbnail.slice <= 2}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <span>{thumbnail.slice}</span>
                  <button
                    onClick={() => sliceThumbnailLayout(1)}
                    disabled={thumbnail.slice >= candidates.length || thumbnail.slice >= 5}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
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
