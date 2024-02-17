"use client"

import { useProgressiveImage } from "@/_hooks/useProgressiveImage"
import { PostCardType } from "@/_types/post/post"
import classNames from "classnames"
import Link from "next/link"
import LoadingBar from "../Loading/LoadingBar"
import NoThumbnail from "../Loading/NoThumbnail"
import "./style.scss"

const participateShowNumber = 8

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
  isEdit?: boolean
}) {
  const imageStatus = useProgressiveImage(thumbnail)

  return (
    <article className="post-card">
      {/* <Profile postId={postId} user={user} like={like} shareCount={shareCount} /> */}
      <div className="post-card-main">
        <Link className="post-card-link" href={`/post/${type}/${postId}`}>
          <h1>{title}</h1>
          <h2>{description}</h2>
          <div className={classNames("thumbnail", { isFull: !description.trim() })}>
            <div className="thumbnail-image">
              {imageStatus === "success" && (
                <div
                  style={{
                    background: `url('${thumbnail}') center / cover`,
                  }}
                />
              )}
              {imageStatus === "error" && <NoThumbnail type="postCard" />}
            </div>
            {imageStatus === "loading" && (
              <div className="loading">
                <LoadingBar />
              </div>
            )}
          </div>
        </Link>
        {participateImages.length > 0 && (
          <div className="participate">
            {participateImages.map((image, i) => (
              <img
                style={{ left: `${i * 13}px` }}
                className="participate-profile"
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
