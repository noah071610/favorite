"use client"

import { ContestPostType, PollingPostType } from "@/_types/post/post"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function PostInfo({ post }: { post: ContestPostType | PollingPostType }) {
  return (
    <div className={cx(style.info)}>
      <div className={cx(style.title)}>
        <h1>{post.title}</h1>
        {post.description.trim() && <h2>{post.description}</h2>}
      </div>
      <div className={cx(style.profile)}>
        <button className={cx(style["user-image"])}>
          <img src={post.user.userImage} alt={`user_image_${post.user.userId}`} />
        </button>
        <div className={cx(style["user-info"])}>
          <span>{post.user.userName}</span>
          <span>2024/01/13</span>
        </div>
      </div>
    </div>
  )
}
