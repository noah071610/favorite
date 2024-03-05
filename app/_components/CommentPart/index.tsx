"use client"

import { queryKey } from "@/_data"
import { toastSuccess } from "@/_data/toast"
import { commenting } from "@/_queries/post"
import { getUser } from "@/_queries/user"
import { CommentType } from "@/_types/post/post"
import { UserQueryType, UserType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import "dayjs/locale/ko" // 한국어 로케일 설정
import { produce } from "immer"
import { useParams } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"

const formattedDate = (date: any) => dayjs(date).locale("ko").format("YYYY년MM월DD일")

function Comment({ user, text, authorId }: { user?: UserType; text: string; authorId: number }) {
  return (
    <div className={"comment-area-wrapper"}>
      <div className={"inner"}>
        <div className={"name-space"}>
          <span className={"name"}>{user?.userName ?? "익명"}</span>
          <span className={"date"}>{formattedDate(new Date())}</span>
          {user?.userId === authorId && <span className={"author"}>작성자</span>}
        </div>
        <div className={"content"}>
          <p className={"text"}>{text}</p>
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
        toastSuccess("commenting")
        setText("")
        setIsFocused(false)
        setDisplayBtn(false)
      })
    }
  }

  return (
    <div className={"comment-area-wrapper"}>
      <div className={`inner ${isPreview ? "preview" : ""}`}>
        <div className={"name-space"}>
          <span className={"name"}>{user?.userName ?? "익명"}</span>
          <span className={"date"}>{formattedDate(new Date())}</span>
          {user?.userId === authorId && <span className={"author"}>작성자</span>}
        </div>
        <div className={"commenting"}>
          <div className={`input ${isFocused ? "focus" : ""}`}>
            <TextareaAutosize
              value={text}
              onChange={handleChange}
              onFocus={() => {
                setIsFocused(true)
                setDisplayBtn(true)
              }}
              onBlur={() => setIsFocused(false)}
            />
            <div className={"border"} />
          </div>
          <div className={`commenting-btn ${displayBtn ? "focus" : ""}`}>
            <div className={"inner"}>
              <button
                onClick={() => {
                  setIsFocused(false)
                  setDisplayBtn(false)
                }}
                className={"cancel"}
              >
                취소
              </button>
              <button onClick={onClickCommenting} className={"submit"}>
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
    <div className={"global-comment-part"}>
      <Commenting setPost={setPost} authorId={authorId} isPreview={isPreview} />
      <section className={"comment-list"}>
        {comments.map(({ text, user: commentUser }, index) => (
          <Comment authorId={authorId} text={text} key={`comment_${index}`} user={commentUser} />
        ))}
      </section>
    </div>
  )
}
