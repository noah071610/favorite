"use client"

import { getUser } from "@/_queries/user"

import { useNewPostStore } from "@/_store/newPost"
import { UserQueryType } from "@/_types/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { posting } from "@/_queries/newPost"
import { PostType } from "@/_types/post/post"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { errorMessage, successMessage } from "@/_data/message"
import { errorToastOptions, successToastOptions } from "@/_data/toast"
import { useMainStore } from "@/_store/main"
import { ErrorTypes } from "@/_types"
import { randomNum } from "@/_utils/math"
import { checkNewPost, generatePostData } from "@/_utils/post"
import classNames from "classNames"
import { toast } from "react-toastify"
import Preview from "./Preview"
import ThumbnailStyle from "./ThumbnailStyle"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function RendingSection() {
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: ["user"],
    queryFn: getUser,
  })

  const queryClient = useQueryClient()
  const router = useRouter()
  const { setModal, modalStatus } = useMainStore()
  const { newPost, candidates, content, setNewPost, clearNewPost, setStatus, thumbnail, setError } = useNewPostStore()
  const [previewPost, setPreviewPost] = useState<PostType | null>(null)
  const [isOnPreview, setIsOnPreview] = useState(false)

  const { mutate } = useMutation({
    mutationKey: ["mainPosts"],
    mutationFn: (newPost: { [key: string]: any }) => posting(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mainPosts"] }) // 캐시를 지우고
      queryClient.refetchQueries({ queryKey: ["mainPosts"] }) // 다시 호출
      router.push("/") // todo
      toast.success(successMessage["posting"], successToastOptions("posting"))
      clearNewPost("all")
      setModal("none")
      localStorage.removeItem("favorite_save_data")
    },
  })

  const sendNewPostError = (type: ErrorTypes | null) => {
    if (!type) return
    setError({ type, text: errorMessage[type] })
    toast.error(errorMessage[type], errorToastOptions)
    setTimeout(() => {
      setError({ type: "clear" })
    }, 3000)
    setStatus("edit")
  }

  const onClickOption = (option: "isSecret") => {
    setNewPost({ type: "format", payload: option })
  }

  const preview = () => {
    const createPost = generatePostData({
      newPost,
      content,
      candidates,
      thumbnail,
      user: {
        userId: 1,
        userImage: "noah",
        userName: "익명",
      },
    })
    const obj = {
      ...createPost,
      format: "preview",
      count: randomNum(40, 200),
      comments: [],
      createdAt: new Date(),
    }
    switch (createPost.type) {
      case "polling":
        obj.content.candidates = obj.content.candidates.map((v: any) => ({
          ...v,
          pick: randomNum(20, 100),
        }))
        setPreviewPost(obj)
        break

      case "contest":
        obj.content.candidates[0].pick = randomNum(20, 100)
        obj.content.candidates[1].pick = randomNum(20, 100)
        setPreviewPost(obj)
        break

      case "tournament":
        obj.content.candidates = obj.content.candidates.map((v: any) => ({
          ...v,
          pick: randomNum(0, 20),
          win: randomNum(20, 100),
          lose: randomNum(20, 100),
        }))
        setPreviewPost(obj)
        break

      default:
        return
    }

    setIsOnPreview(true)
  }

  const validate = async (type: "preview" | "posting") => {
    const check = checkNewPost(newPost, content, candidates, thumbnail)
    if (check) return sendNewPostError(check)

    if (type === "preview") {
      preview()
    } else {
      if (userData) {
        if (!userData.user) {
          toast.success(successMessage["loginNewPost"], successToastOptions("loginNewPost"))
          setModal("loginNewPost")
        } else {
          const createPost = generatePostData({ newPost, content, candidates, thumbnail, user: userData.user })
          mutate(createPost)
        }
      }
    }
  }
  useEffect(() => {
    if (userData?.user && modalStatus === "newPostLoginSuccess") {
      const createPost = generatePostData({ newPost, content, candidates, thumbnail, user: userData.user })
      mutate(createPost)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalStatus, userData])

  return (
    <>
      <div className={cx(style.rending)}>
        <section className={cx(style["rending-section"])}>
          <h1>썸네일 변경</h1>
          <ThumbnailStyle />
        </section>
        <div className={cx(style.finish)}>
          <div className={cx(style.option, { [style.active]: newPost?.format === "secret" })}>
            <span>비공개 콘텐츠</span>
            <button onClick={() => onClickOption("isSecret")} className={cx(style.bar)}>
              <div className={cx(style.circle)}></div>
            </button>
          </div>
          <div className={cx(style["btn-wrapper"])}>
            <button onClick={() => validate("preview")}>미리 플레이 해보기</button>
            <button onClick={() => validate("posting")}>포스팅 하기</button>
          </div>
        </div>
      </div>
      {previewPost && isOnPreview && <Preview previewPost={previewPost} setIsOnPreview={setIsOnPreview} />}
    </>
  )
}
