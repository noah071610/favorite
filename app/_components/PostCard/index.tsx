"use client"

import { getImageUrl } from "@/_data"
import { contentTypesArr, getThumbnail } from "@/_data/post"
import { usePreloadImages } from "@/_hooks/usePreloadImages"
import { PostCardType } from "@/_types/post/post"
import { formatNumber } from "@/_utils/math"
import classNames from "classNames"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import CountUp from "react-countup"
import NoThumbnail from "../@Global/Loading/NoThumbnail"
import ShareModal from "./ShareModal"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function PostCard({
  postCard,
  isTemplate,
  loadTemplate,
}: {
  postCard: PostCardType
  isTemplate?: boolean
  loadTemplate?: (postCard: PostCardType) => void
}) {
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
    <article className={cx(style.card)}>
      <div className={cx(style["card-main"], { [style.template]: isTemplate })}>
        <div onClick={onClickPlay} className={cx(style["card-inner"], { [style.notTemplate]: !isTemplate })}>
          <div className={cx(style.thumbnail, { isFull: !description.trim() })}>
            <div className={cx(style["thumbnail"])}>
              {!thumbnail ? (
                <NoThumbnail type="post-card" />
              ) : isImagesLoaded ? (
                thumbnailArr.length > 0 && (
                  <div className={cx(style["thumbnail-inner"])}>
                    {thumbnailArr.map((v, i) => (
                      <div
                        key={`thumb_${postId}_${i}`}
                        className={cx(style.image)}
                        style={{
                          background: getImageUrl({ url: v, isCenter: true }),
                        }}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className={cx(style.loading)}></div>
              )}
            </div>
          </div>

          <div className={cx(style.text)}>
            <h1>{title}</h1>
            <h2>{description}</h2>
          </div>
        </div>

        <div className={cx(style.info)}>
          {typeData && !isTemplate && (
            <div className={cx(style.badge)}>
              <Link href={typeData.link} className={cx(style["badge-main"], style[typeData.value])}>
                <span>
                  {typeData.icon(style)}
                  <span className={cx(style.label)}>{typeData.label}</span>
                </span>
              </Link>
            </div>
          )}
          <div className={cx(style["info-main"])}>
            <div className={cx(style.left)}>
              {isTemplate ? (
                typeData && (
                  <div className={cx(style["template-badge"], style[typeData.value])}>
                    <span>
                      {typeData.icon(style)}
                      <span className={cx(style.label)}>{typeData.label}</span>
                    </span>
                  </div>
                )
              ) : (
                <>
                  {typeData && (
                    <div className={cx(style["mobile-badge"])}>
                      <Link href={typeData.link} className={cx(style["badge-main"], style[typeData.value])}>
                        <span>
                          {typeData.icon(style)}
                          <span className={cx(style.label)}>{typeData.label}</span>
                        </span>
                      </Link>
                    </div>
                  )}
                  <div>
                    <CountUp
                      className={cx(style.count)}
                      suffix={suffix}
                      duration={4}
                      decimals={!suffix ? 0 : 1}
                      decimal="."
                      separator=" "
                      end={parseFloat(num)}
                    />
                    <span className={cx(style.suffix)}>명 참여</span>
                  </div>
                </>
              )}
            </div>
            <div className={cx(style.right, { [style.template]: isTemplate })}>
              <Link href={`/post/${type}/${postId}`}>
                <i className={cx("fa-solid", "fa-play")}></i>
                <span>{isTemplate ? "플레이 해보기" : "플레이"}</span>
              </Link>
              <button onClick={onClickPrimaryBtn}>
                <i className={cx("fa-solid", "fa-arrow-up-from-bracket")}></i>
                <span>{isTemplate ? "템플릿 사용하기" : "공유하기"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {onShareModal && !isTemplate && <ShareModal postCard={postCard} setOnShareModal={setOnShareModal} />}
    </article>
  )
}
