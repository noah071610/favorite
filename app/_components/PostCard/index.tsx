"use client"

import { getImageUrl } from "@/_data"
import { contentTypesArr, getThumbnail } from "@/_data/post"
import { useIntersectionObserver } from "@/_hooks/useIntersectionObserver"
import { PostCardType } from "@/_types/post"
import { formatNumber } from "@/_utils/math"
import { useTranslation } from "@/i18n/client"
import { faArrowUpFromBracket, faEye, faEyeSlash, faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { memo, useEffect, useState } from "react"
import CountUp from "react-countup"
import FavoriteLoading from "../@Global/Loading/FavoriteLoading"
import NoThumbnail from "../@Global/Loading/NoThumbnail"

const ShareModal = dynamic(() => import("./ShareModal"), {
  loading: () => <FavoriteLoading type="full" />,
})

function PostCard({
  postCard,
  isTemplate,
  isUserPage,
  onClickUserPageBtn,
  loadTemplate,
}: {
  postCard: PostCardType
  isTemplate?: boolean
  isUserPage?: boolean
  onClickUserPageBtn?: (type: "delete" | "edit", target: PostCardType) => void
  loadTemplate?: (postCard: PostCardType) => void
}) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["post-card", "post-common"])
  const router = useRouter()
  const { description, type, postId, thumbnail, title, count, format } = postCard
  const [onShareModal, setOnShareModal] = useState(false)

  const [ref, isIntersecting] = useIntersectionObserver()
  const thumbnailArr = getThumbnail(thumbnail)
  const [isImagesLoaded, setIsImagesLoaded] = useState(false)
  const [alreadyLoaded, setAlreadyLoaded] = useState(false)
  const [imageLoadedCount, setImageLoadedCount] = useState(0)

  const { num, suffix } = formatNumber(count)
  const typeData = contentTypesArr.find((v) => v.value === type)

  useEffect(() => {
    if (imageLoadedCount >= thumbnailArr.length && alreadyLoaded) {
      setIsImagesLoaded(true)
    }
  }, [thumbnailArr, imageLoadedCount, alreadyLoaded])

  useEffect(() => {
    if (!!thumbnailArr.length && isIntersecting && !alreadyLoaded) {
      setAlreadyLoaded(true)
      thumbnailArr.forEach((imageSrc) => {
        const image = new Image()
        image.src = imageSrc
        image.onload = () => {
          setImageLoadedCount((prevCount) => prevCount + 1)
        }
        image.onerror = () => {
          setImageLoadedCount((prevCount) => prevCount + 1)
        }
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbnailArr, isIntersecting, alreadyLoaded])

  const onClickPrimaryBtn = () => {
    if (isTemplate && loadTemplate) {
      loadTemplate(postCard)
    } else {
      setOnShareModal(true)
    }
  }

  const onClickPlay = () => {
    if (isUserPage) {
      return router.push(`/post/edit/${postId}`)
    }
    return router.push(`/post/${postId}`)
  }

  return (
    <article className={classNames("global-post-card")}>
      <div ref={ref as any} className={classNames("main", { template: isTemplate })}>
        <div onClick={onClickPlay} className={classNames("inner", { notTemplate: !isTemplate })}>
          <div className={classNames(thumbnail, { isFull: !description?.trim() })}>
            <div className={classNames("thumbnail")}>
              {!thumbnail ? (
                <NoThumbnail type="post-card" />
              ) : isImagesLoaded ? (
                thumbnailArr.length > 0 && (
                  <div className={classNames("thumbnail-inner")}>
                    {thumbnailArr.map((v, i) => (
                      <div
                        key={`thumb_${postId}_${i}`}
                        className={classNames("image")}
                        style={{
                          background: getImageUrl({ url: v, isCenter: true }),
                        }}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className={classNames("loading")}></div>
              )}
            </div>
          </div>

          <div className={classNames("text")}>
            <h1>{!!title ? title : "제목 없음"}</h1>
            <h2>{description}</h2>
          </div>
        </div>

        <div className={classNames("info")}>
          {typeData && !isTemplate && (
            <div className={classNames("badge")}>
              <Link href={typeData.link} className={classNames("badge-main", typeData.value)}>
                <span>
                  {typeData.icon("style")}
                  <span className={classNames("label")}>{t(`${typeData.label}`, { ns: "post-common" })}</span>
                </span>
              </Link>
              {isUserPage && (
                <div className={classNames("badge-format-main", format)}>
                  <span>
                    <FontAwesomeIcon icon={format === "default" ? faEye : faEyeSlash} />
                    <span className={classNames("label")}>{t(`options.${format}`, { ns: "post-common" })}</span>
                  </span>
                </div>
              )}
            </div>
          )}
          <div className={classNames("info-main")}>
            <div className={classNames("left")}>
              {isTemplate ? (
                typeData && (
                  <div className={classNames("template-badge", typeData.value)}>
                    <span>
                      {typeData.icon("style")}
                      <span className={classNames("label")}>{t(typeData.label, { ns: "post-common" })}</span>
                    </span>
                  </div>
                )
              ) : (
                <>
                  {typeData && (
                    <div className={classNames("mobile-badge")}>
                      <Link href={typeData.link} className={classNames("badge-main", typeData.value)}>
                        <span>
                          {typeData.icon("style")}
                          <span className={classNames("label")}>{t(typeData.label, { ns: "post-common" })}</span>
                        </span>
                      </Link>
                      {isUserPage && (
                        <div className={classNames("badge-format-main", format)}>
                          <span>
                            <FontAwesomeIcon icon={format === "default" ? faEye : faEyeSlash} />
                            <span className={classNames("label")}>{t(`options.${format}`, { ns: "post-common" })}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <CountUp
                      className={classNames("count")}
                      suffix={t(suffix)}
                      duration={4}
                      decimals={!suffix ? 0 : 1}
                      decimal="."
                      separator=" "
                      end={parseFloat(num)}
                    />
                    <span className={classNames("suffix")}>{t("participate")}</span>
                  </div>
                </>
              )}
            </div>
            <div className={classNames("right", { template: isTemplate })}>
              {isUserPage ? (
                <>
                  <button onClick={() => onClickUserPageBtn && onClickUserPageBtn("edit", postCard)}>
                    <span style={{ marginLeft: "0" }}>{t("editing", { ns: "post-common" })}</span>
                  </button>
                  <button onClick={() => onClickUserPageBtn && onClickUserPageBtn("delete", postCard)}>
                    <span style={{ marginLeft: "0" }}>{t("deletePost", { ns: "post-common" })}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href={`/post/${postId}`}>
                    <FontAwesomeIcon icon={faPlay} />
                    <span>{isTemplate ? t("playContent") : t("playContentShort")}</span>
                  </Link>
                  <button onClick={onClickPrimaryBtn}>
                    <FontAwesomeIcon icon={faArrowUpFromBracket} />
                    <span>{isTemplate ? t("useTemplate") : t("shareContent")}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {onShareModal && !isTemplate && <ShareModal postCard={postCard} setOnShareModal={setOnShareModal} />}
    </article>
  )
}

export default memo(PostCard)
