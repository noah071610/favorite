"use client"

import { getImageUrl } from "@/_data"
import { contentTypesArr, getThumbnail } from "@/_data/post"
import { usePreloadImages } from "@/_hooks/usePreloadImages"
import { TemplatePostCardType } from "@/_types/post/post"
import { formatNumber } from "@/_utils/math"
import classNames from "classNames"
import Link from "next/link"
import NoThumbnail from "../@Global/Loading/NoThumbnail"
import style from "./style.module.scss"
const cx = classNames.bind(style)

// todo: 이미지 어레이 그거 타입 지우기

export default function TemplateCard({ postCard }: { postCard: TemplatePostCardType }) {
  const { description, type, postId, thumbnail, title, count } = postCard
  const thumbnailArr = getThumbnail(thumbnail)
  const isImagesLoaded = usePreloadImages(thumbnailArr)

  const { num, suffix } = formatNumber(count)

  const typeData = contentTypesArr.find((v) => v.value === type)

  const onClickUseTemplate = () => {}

  return (
    <article className={cx(style.card)}>
      <div className={cx(style["card-main"])}>
        <Link href={`/post/${type}/${postId}`} className={cx(style["card-inner"])}>
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
        </Link>

        <div className={cx(style.info)}>
          {typeData && (
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
            <div className={cx(style["btn-wrapper"])}>
              <a href={`/post/${type}/${postId}`} target="_blank">
                <i className={cx("fa-solid", "fa-play")}></i>
                <span>미리 플레이</span>
              </a>
              <button onClick={onClickUseTemplate}>
                <i className={cx("fa-solid", "fa-check")}></i>
                <span>템플릿 사용</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </article>
  )
}
