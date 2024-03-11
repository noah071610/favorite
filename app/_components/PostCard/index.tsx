"use client"

import { getImageUrl } from "@/_data"
import { contentTypesArr, getThumbnail } from "@/_data/post"
import { usePreloadImages } from "@/_hooks/usePreloadImages"
import { PostCardType } from "@/_types/post/post"
import { formatNumber } from "@/_utils/math"
import { faArrowUpFromBracket, faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { memo, useState } from "react"
import CountUp from "react-countup"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation(["content", "messages"])
  const router = useRouter()
  const { description, type, postId, thumbnail, title, count } = postCard
  const [onShareModal, setOnShareModal] = useState(false)
  const thumbnailArr = getThumbnail(thumbnail)
  const isImagesLoaded = usePreloadImages(thumbnailArr)

  const { num, suffix } = formatNumber(count)

  const typeData = contentTypesArr.find((v) => v.value === type)

  const onClickPrimaryBtn = () => {
    if (isTemplate && loadTemplate) {
      loadTemplate(postCard)
    } else {
      setOnShareModal(true)
    }
  }

  const onClickPlay = () => {
    if (isTemplate) {
    } else {
      router.push(`/post/${type}/${postId}`)
    }
  }

  return (
    <article className={classNames("global-post-card")}>
      <div className={classNames("main", { template: isTemplate })}>
        <div onClick={onClickPlay} className={classNames("inner", { notTemplate: !isTemplate })}>
          <div className={classNames(thumbnail, { isFull: !description.trim() })}>
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
            <h1>{title}</h1>
            <h2>{description}</h2>
          </div>
        </div>

        <div className={classNames("info")}>
          {typeData && !isTemplate && (
            <div className={classNames("badge")}>
              <Link href={typeData.link} className={classNames("badge-main", typeData.value)}>
                <span>
                  {typeData.icon("style")}
                  <span className={classNames("label")}>{t(`${typeData.label}`)}</span>
                </span>
              </Link>
            </div>
          )}
          <div className={classNames("info-main")}>
            <div className={classNames("left")}>
              {isTemplate ? (
                typeData && (
                  <div className={classNames("template-badge", typeData.value)}>
                    <span>
                      {typeData.icon("style")}
                      <span className={classNames("label")}>{t(typeData.label)}</span>
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
                          <span className={classNames("label")}>{t(typeData.label)}</span>
                        </span>
                      </Link>
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
                    <span style={{ marginLeft: "0" }}>{t("수정하기")}</span>
                  </button>
                  <button onClick={() => onClickUserPageBtn && onClickUserPageBtn("delete", postCard)}>
                    <span style={{ marginLeft: "0" }}>{t("삭제하기")}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href={`/post/${type}/${postId}`}>
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
