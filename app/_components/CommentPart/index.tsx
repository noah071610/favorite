"use client"

import { fadeMoveUpAnimation } from "@/_styles/animation"
import { PollingPostType } from "@/_types/post/post"
import { UserType } from "@/_types/user"
import classNames from "classnames"
import { useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import "./style.scss"

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
    <div style={animation ? { animation, opacity: 0 } : {}} className="comment-area">
      <div className="comment-area-profile">
        <div className="user-image">
          <img className={classNames({ focus: isFocused })} src={user.userImage} alt={`user_image_${user.userId}`} />
        </div>
      </div>
      <div className="comment-area-text">
        <div className="comment-area-name-space">
          <span className="name">{user.userName}</span>
        </div>
        {isPostComment ? (
          <>
            <div className={classNames("comment-area-text-inner", { focus: isFocused })}>
              <TextareaAutosize onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} />
              <div className="border" />
            </div>
            <div
              style={{
                display: isFocused ? "flex" : "none",
              }}
              className="comment-area-btn"
            >
              <div className="comment-area-btn-inner">
                <button className="cancel">취소</button>
                <button className="submit">코멘트</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="comment-area-content">{text}</p>
            <div className="like">
              <button className="like-btn">
                <i className="fa-regular fa-heart" />
              </button>
              <span>{like}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function CommentPart({ post }: { post: PollingPostType }) {
  const comments = post?.comments ?? []

  return (
    post && (
      <div className="comment">
        <CommentArea isPostComment={true} user={post.user} />
        <section className="comments">
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
