"use client"

import { fadeMoveUpAnimation } from "@/_styles/animation"
import { ContestPostType, PollingPostType } from "@/_types/post/post"
import { UserType } from "@/_types/user"
import classNames from "classNames"
import { useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function CommentArea({
  isPostComment,
  user,
  text,
  like,
  animation,
}: {
  isPostComment: boolean
  user: UserType
  text?: string
  like?: number
  animation?: string
}) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div style={animation ? { animation, opacity: 0 } : {}} className={cx(style["area-wrapper"])}>
      <div className={cx(style["profile"])}>
        <div className={cx(style["user-image"])}>
          <img className={cx({ focus: isFocused })} src={user.userImage} alt={`user_image_${user.userId}`} />
        </div>
      </div>
      <div className={cx(style["inner"])}>
        <div className={cx(style["name-space"])}>
          <span className={cx(style.name)}>{user.userName}</span>
        </div>
        {isPostComment ? (
          <div className={cx(style["commenting"])}>
            <div className={cx(style.input, { [style.focus]: isFocused })}>
              <TextareaAutosize onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
              <div className={cx(style.border)} />
            </div>
            <div
              style={{
                display: isFocused ? "flex" : "none",
              }}
              className={cx(style["btn"])}
            >
              <div className={cx(style["btn-inner"])}>
                <button className={cx(style.cancel)}>취소</button>
                <button className={cx(style.submit)}>코멘트</button>
              </div>
            </div>
          </div>
        ) : (
          <div className={cx(style.comment)}>
            <p className={cx(style["text"])}>{text}</p>
            <div className={cx(style.like)}>
              <button className={cx(style["like-btn"])}>
                <i className={cx("fa-regular", "fa-heart")} />
              </button>
              <span>{like}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CommentPart({ post }: { post: PollingPostType | ContestPostType }) {
  const comments = post?.comments ?? []

  return (
    post && (
      <div className={cx(style["comment-part"])}>
        <CommentArea isPostComment={true} user={post.user} />
        <section className={cx(style.comments)}>
          {comments.map(({ text, like, user: commentUser }, index) => (
            <CommentArea
              isPostComment={false}
              text={text}
              key={`${post.postId}_comment_${index}`}
              user={commentUser}
              like={like}
              animation={fadeMoveUpAnimation(700 + index * 20, index * 100).animation}
            />
          ))}
        </section>
      </div>
    )
  )
}
