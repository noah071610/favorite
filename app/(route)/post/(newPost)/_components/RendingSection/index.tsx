"use client"

import { getUser } from "@/_queries/user"

import { useNewPostStore } from "@/_store/newPost"
import { UserQueryType } from "@/_types/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { posting } from "@/_queries/newPost"
import { PostType } from "@/_types/post/post"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { queryKey } from "@/_data"
import { errorMessage } from "@/_data/message"
import { toastError, toastSuccess } from "@/_data/toast"
import { useMainStore } from "@/_store/main"
import { ErrorTypes } from "@/_types"
import { randomNum } from "@/_utils/math"
import { checkNewPost, generatePostData } from "@/_utils/post"
import classNames from "classNames"
import Preview from "./Preview"
import ThumbnailStyle from "./ThumbnailStyle"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function RendingSection() {
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: queryKey.user,
    queryFn: getUser,
  })

  const queryClient = useQueryClient()
  const router = useRouter()
  const { setModal, modalStatus, setError } = useMainStore()
  const { newPost, candidates, content, setNewPost, clearNewPost, setStatus, thumbnail } = useNewPostStore()
  const [previewPost, setPreviewPost] = useState<PostType | null>(null)
  const [isOnPreview, setIsOnPreview] = useState(false)

  const { mutate } = useMutation({
    mutationKey: queryKey.new.create,
    mutationFn: (newPost: { [key: string]: any }) => posting(newPost),
    onMutate: async (createNewPost) => {
      await queryClient.cancelQueries({ queryKey: queryKey.home.all })

      // Snapshot the previous value
      const previous = queryClient.getQueryData(queryKey.home.all)

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey.home.all, (old: any) => {
        if (!old) return undefined
        old.pages[0].unshift(createNewPost)
        return old
      })

      // Return a context object with the snapshotted value
      return { previous }
    },
    onSuccess: () => {
      localStorage.removeItem("favorite_save_data")

      setStatus("init")
      setModal("none")
      clearNewPost("all")

      router.push("/") // todo
      toastSuccess("posting")
    },
    onError: () => {
      toastError("unknown")
    },
  })

  const sendNewPostError = (type: ErrorTypes | null) => {
    if (!type) return
    setError({ type, text: errorMessage[type] })
    toastError(type)
    setTimeout(() => {
      setError({ type: "clear" })
    }, 3000)
    setStatus("edit")
  }

  const onClickOption = (option: "isSecret") => {
    setNewPost({ type: "format", payload: option })
  }

  const preview = () => {
    const user = userData?.user
      ? userData.user
      : {
          userId: 1,
          userImage: "noah",
          userName: "익명",
        }
    const createPost = {
      ...generatePostData({
        newPost,
        content,
        candidates,
        thumbnail,
        user,
      }),
      format: "preview",
      count: randomNum(40, 200),
      comments: [],
      user,
      createdAt: new Date(),
    }
    switch (createPost.type) {
      case "polling":
        createPost.content.candidates = createPost.content.candidates.map((v: any) => ({
          ...v,
          pick: randomNum(20, 100),
        }))
        setPreviewPost(createPost)
        break

      case "contest":
        createPost.content.candidates[0].pick = randomNum(20, 100)
        createPost.content.candidates[1].pick = randomNum(20, 100)
        setPreviewPost(createPost)
        break

      case "tournament":
        createPost.content.candidates = createPost.content.candidates.map((v: any) => {
          // total : 100 기준
          const random = randomNum(10, 100)
          return {
            ...v,
            pick: randomNum(0, 50),
            win: random,
            lose: 100 - random,
          }
        })
        setPreviewPost(createPost)
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
          toastSuccess("loginNewPost")
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
  }, [modalStatus, userData, newPost, content, candidates, thumbnail])

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
