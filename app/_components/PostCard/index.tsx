"use client"

import { useProgressiveImage } from "@/_hooks/useProgressiveImage"
import { PostCardType } from "@/_types/post/post"
import classNames from "classNames"
import Link from "next/link"
import LoadingBar from "../Loading/LoadingBar"
import NoThumbnail from "../Loading/NoThumbnail"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const participateShowNumber = 8

// todo: 이미지 어레이 그거 타입 지우기

export default function PostCard({
  postCard: {
    description,
    type,
    postId,
    thumbnail,
    title,
    info: { participateImages, participateCount },
  },
}: {
  postCard: PostCardType
}) {
  const imageStatus = useProgressiveImage(thumbnail)

  return (
    <article className={cx(style.card)}>
      <div className={cx(style["card-main"])}>
        <Link className={cx(style["card-link"])} href={`/post/${type}/${postId}`}>
          <h1>{title}</h1>
          <h2>{description}</h2>
          <div className={cx(style.thumbnail, { isFull: !description.trim() })}>
            <div className={cx(style["thumbnail"])}>
              {imageStatus === "success" && (
                <div
                  className={cx(style.image)}
                  style={{
                    background: `url('${thumbnail}') center / cover`,
                  }}
                />
              )}
              {imageStatus === "error" && <NoThumbnail type="post-card" />}
            </div>
            {imageStatus === "loading" && (
              <div className={cx(style.loading)}>
                <LoadingBar />
              </div>
            )}
          </div>
        </Link>
        <div></div>
        {participateImages.length > 0 && (
          <div className={cx(style.participate)}>
            {participateImages.map((image, i) => (
              <img
                style={{ left: `${i * 13}px` }}
                className={cx(style["participate-profile"])}
                key={`${postId}_participate_${i + 1}`}
                src={image}
                alt={`${postId}_participate_${i + 1}`}
              />
            ))}
            {/* memo: 기본패딩 + 프로필 하나 + 13픽셀 겹친 프로필 나머지 */}
            <span
              style={{
                paddingLeft: `${4 + 25 + (participateImages.length - 1) * 13}px`,
              }}
            >
              {participateImages.length > participateShowNumber
                ? `등 총 ${participateCount}명 참여`
                : `${participateCount}명 참여`}
            </span>
          </div>
        )}
      </div>
    </article>
  )
}
