"use client"

import { useProgressiveImage } from "@/_hooks/useProgressiveImage"
import { PostCardType } from "@/_types/post/post"
import classNames from "classNames"
import Link from "next/link"
import CountUp from "react-countup"
import LoadingBar from "../Loading/LoadingBar"
import NoThumbnail from "../Loading/NoThumbnail"
import style from "./style.module.scss"
const cx = classNames.bind(style)

// todo: 이미지 어레이 그거 타입 지우기

export default function PostCard({
  postCard: { description, type, postId, thumbnail, title, count },
}: {
  postCard: PostCardType
}) {
  const imageStatus = useProgressiveImage(thumbnail)

  return (
    <article className={cx(style.card)}>
      <div className={cx(style["card-main"])}>
        <Link href={`/post/${type}/${postId}`} className={cx(style["card-inner"])}>
          <div className={cx(style.title)}>
            <h1>{title}</h1>
          </div>
          {!!description && <h2>{description}</h2>}

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

        <div className={cx(style.info)}>
          <div className={cx(style.left)}>
            <CountUp className={cx(style.count)} duration={4} end={count} />
            <span className={cx(style.suffix)}>명 참여</span>
          </div>
          <div className={cx(style.right)}>
            <button>
              <i className={cx("fa-solid", "fa-play")}></i>
              <span>플레이</span>
            </button>
            <button>
              <i className={cx("fa-solid", "fa-arrow-up-from-bracket")}></i>
              <span>공유하기</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
