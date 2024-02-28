"use client"

import { successMessage } from "@/_data/message"
import { successToastOptions } from "@/_data/toast"
import { commenting } from "@/_queries/post"
import { getUser } from "@/_queries/user"
import { CommentType, PostType } from "@/_types/post/post"
import { UserQueryType, UserType } from "@/_types/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import classNames from "classNames"
import dayjs from "dayjs"
import "dayjs/locale/ko" // 한국어 로케일 설정
import { produce } from "immer"
import { useParams } from "next/navigation"
import { useState } from "react"
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

function Commenting({ authorId, isPreview }: { authorId: number; isPreview: boolean }) {
  const queryClient = useQueryClient()
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: ["user"],
    queryFn: getUser,
  })
  const user = userData?.user
  const { postId } = useParams()
  const { mutate } = useMutation({
    mutationKey: ["post", postId],
    mutationFn: ({ userId, postId, text }: { userId: number; postId: string; text: string }) =>
      commenting({ userId, postId, text }),
    onMutate: async (comment) => {
      await queryClient.cancelQueries({ queryKey: ["post", postId] })

      await queryClient.setQueryData(["post", postId], (oldData: PostType) =>
        produce(oldData, (draft) => {
          draft.comments.unshift({
            user: {
              userId: 1,
              userName: "temp",
              userImage: "??",
            },
            commentId: oldData.comments.length,
            text: comment.text,
          })
        })
      )
    },
    onSuccess: () => {
      toast.success(successMessage["commenting"], successToastOptions("commenting"))
    },
  })

  const [isFocused, setIsFocused] = useState(false)
  const [displayBtn, setDisplayBtn] = useState(false)
  const [text, setText] = useState("")
  const handleChange = (event: any) => {
    setText(event.target.value) // 입력된 값을 상태 변수에 업데이트합니다.
  }

  const onClickCommenting = () => {
    if (!!text.trim() && !isPreview) {
      mutate({ userId: user?.userId ?? 1, postId: postId as string, text })
      setText("")
      setIsFocused(false)
      setDisplayBtn(false)
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
}: {
  authorId: number
  comments: CommentType[]
  isPreview: boolean
}) {
  return (
    <div className={cx(style["comment-part"])}>
      <Commenting authorId={authorId} isPreview={isPreview} />
      <section className={cx(style["comment-list"])}>
        {comments.map(({ text, user: commentUser }, index) => (
          <Comment authorId={authorId} text={text} key={`comment_${index}`} user={commentUser} />
        ))}
      </section>
    </div>
  )
}
