"use client"

import { useMainStore } from "@/_store"
import { UserType } from "@/_types/post"
import { fadeMoveUpAnimation } from "@/_utils/animation"
import { dummyComments, dummyUser } from "@/_utils/faker"
import classNames from "classnames"
import { useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import "swiper/css"
import "swiper/css/free-mode" // todo
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
              <button className="cancel">취소</button>
              <button className="submit">코멘트</button>
            </div>
          </>
        ) : (
          <>
            <p className="comment-area-content">{text}</p>
            <div className="like">
              <button className="like-btn">
                <i className="fa-regular fa-heart"></i>
              </button>
              <span>2</span>
              {/* todo: 카운트 */}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function CommentPart() {
  const user = dummyUser
  const {
    selectedCandidate: { title, number }, // todo: null 해결
  } = useMainStore()
  return (
    <div className="comment">
      <CommentArea isPostComment={true} user={user} />
      <section className="comments">
        {dummyComments.map(({ text, favorite: { id, color, number } }, index) => (
          // todo: number는 꼭 필요할까?
          <CommentArea
            isPostComment={false}
            text={text}
            key={`postId_comment_${id}_${index}`} // todo: 포스트 아이디
            user={user}
            animation={fadeMoveUpAnimation(700 + index * 20, index * 100).animation}
          />
        ))}
      </section>
    </div>
  )
}
