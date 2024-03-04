"use client"

import { queryKey } from "@/_data"
import { successMessage } from "@/_data/message"
import { successToastOptions } from "@/_data/toast"
import { commenting } from "@/_queries/post"
import { getUser } from "@/_queries/user"
import { CommentType } from "@/_types/post/post"
import { UserQueryType, UserType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import classNames from "classNames"
import dayjs from "dayjs"
import "dayjs/locale/ko" // 한국어 로케일 설정
import { produce } from "immer"
import { useParams } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "react-toastify"
import style from "./style.module.scss"

const formattedDate = (date: any) => dayjs(date).locale("ko").format("YYYY년MM월DD일")

const cx = classNames.bind(style)

function Comment({ user, text, authorId }: { user?: UserType; text: string; authorId: number }) {
  return (
    <div className={cx(style["comment-area-wrapper"])}>
      <div className={cx(style["inner"])}>
        <div className={cx(style["name-space"])}>
          <span className={cx(style.name)}>{user?.userName ?? "익명"}</span>
          <span className={cx(style.date)}>{formattedDate(new Date())}</span>
          {user?.userId === authorId && <span className={cx(style.author)}>작성자</span>}
        </div>
        <div className={cx(style.content)}>
          <p className={cx(style["text"])}>{text}</p>
        </div>
      </div>
    </div>
  )
}

function Commenting({
  authorId,
  isPreview,
  setPost,
}: {
  authorId: number
  isPreview: boolean
  setPost: Dispatch<SetStateAction<{ [key: string]: any; comments: CommentType[] }>>
}) {
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user,
    queryFn: getUser,
  })
  const user = userData?.user
  const { postId } = useParams()

  const [isFocused, setIsFocused] = useState(false)
  const [displayBtn, setDisplayBtn] = useState(false)
  const [text, setText] = useState("")
  const handleChange = (event: any) => {
    setText(event.target.value)
  }

  const onClickCommenting = async () => {
    if (!!text.trim() && !isPreview) {
      await commenting({
        userId: user?.userId ?? 1,
        postId: postId as string,
        text,
      }).then(() => {
        setPost((oldData) =>
          produce(oldData, (draft) => {
            draft.comments.unshift({
              user: {
                userId: user?.userId ?? 1,
                userName: user?.userName ?? "익명",
                userImage: user?.userImage ?? "",
              },
              commentId: oldData.comments.length,
              text,
            })
          })
        )
        toast.success(successMessage["commenting"], successToastOptions("commenting"))
        setText("")
        setIsFocused(false)
        setDisplayBtn(false)
      })
    }
  }

  return (
    <div className={cx(style["comment-area-wrapper"])}>
      <div className={cx(style["inner"], { [style.preview]: isPreview })}>
        <div className={cx(style["name-space"])}>
          <span className={cx(style.name)}>{user?.userName ?? "익명"}</span>
          <span className={cx(style.date)}>{formattedDate(new Date())}</span>
          {user?.userId === authorId && <span className={cx(style.author)}>작성자</span>}
        </div>
        <div className={cx(style["commenting"])}>
          <div className={cx(style.input, { [style.focus]: isFocused })}>
            <TextareaAutosize
              value={text}
              onChange={handleChange}
              onFocus={() => {
                setIsFocused(true)
                setDisplayBtn(true)
              }}
              onBlur={() => setIsFocused(false)}
            />
            <div className={cx(style.border)} />
          </div>
          <div className={cx(style["commenting-btn"], { [style.focus]: displayBtn })}>
            <div className={cx(style["inner"])}>
              <button
                onClick={() => {
                  setIsFocused(false)
                  setDisplayBtn(false)
                }}
                className={cx(style.cancel)}
              >
                취소
              </button>
              <button onClick={onClickCommenting} className={cx(style.submit)}>
                코멘트
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommentPart({
  authorId,
  comments,
  isPreview,
  setPost,
}: {
  authorId: number
  comments: CommentType[]
  isPreview: boolean
  setPost: Dispatch<SetStateAction<any>>
}) {
  return (
    <div className={cx(style["comment-part"])}>
      <Commenting setPost={setPost} authorId={authorId} isPreview={isPreview} />
      <section className={cx(style["comment-list"])}>
        {comments.map(({ text, user: commentUser }, index) => (
          <Comment authorId={authorId} text={text} key={`comment_${index}`} user={commentUser} />
        ))}
      </section>
    </div>
  )
}
