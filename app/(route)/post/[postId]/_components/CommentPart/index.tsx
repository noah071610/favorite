"use client"

import { getPost } from "@/_queries/post"
import { fadeMoveUpAnimation } from "@/_styles/animation"
import { PostType, UserType } from "@/_types/post"
import { useQuery } from "@tanstack/react-query"
import classNames from "classnames"
import { useParams } from "next/navigation"
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
              <div className="border"></div>
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
                <i className="fa-regular fa-heart"></i>
              </button>
              <span>{like}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function CommentPart() {
  const { postId } = useParams<{ postId: string }>()
  const { data: post } = useQuery<PostType>({
    queryKey: ["getPost"],
    queryFn: () => getPost(postId),
  })

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
              key={`postId_comment_${index}`} // todo: 포스트 아이디
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
