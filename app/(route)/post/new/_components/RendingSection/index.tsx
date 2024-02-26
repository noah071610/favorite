"use client"

import { getUser } from "@/_queries/user"
import { cloneDeep } from "lodash"

import { useNewPostStore } from "@/_store/newPost"
import { UserQueryType } from "@/_types/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { posting } from "@/_queries/newPost"
import { useContestStore } from "@/_store/newPost/contest"
import { usePollingStore } from "@/_store/newPost/polling"
import { NewPostType, PostOptionType } from "@/_types/post/post"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { errorMessage, successMessage } from "@/_data/message"
import { errorToastOptions, successToastOptions } from "@/_data/toast"
import { useMainStore } from "@/_store/main"
import { useTournamentStore } from "@/_store/newPost/tournament"
import { ErrorTypes } from "@/_types"
import { ContestPostType } from "@/_types/post/contest"
import { PollingCandidateType, PollingPostType } from "@/_types/post/polling"
import { TournamentCandidateType, TournamentPostType } from "@/_types/post/tournament"
import { randomNum } from "@/_utils/math"
import classNames from "classNames"
import { nanoid } from "nanoid"
import { toast } from "react-toastify"
import Preview from "./Preview"
import ThumbnailStyle from "./ThumbnailStyle"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function sliceArray(array: any[]) {
  const result = []
  for (let i = 0; i < array.length; i += 12) {
    result.push(array.slice(i, i + 12)) // memo: 페이지당 카드 12개
  }
  return result
}

export default function RendingSection() {
  const { data: userData } = useQuery<UserQueryType>({
    queryKey: ["user"],
    queryFn: getUser,
  })

  const queryClient = useQueryClient()
  const router = useRouter()
  const { setModal, modalStatus } = useMainStore()
  const { newPost, setNewPost, clearNewPost, setStatus, setError } = useNewPostStore()
  const { clearContestContent, contestContent } = useContestStore()
  const { clearTournamentContent, tournamentContent } = useTournamentStore()
  const { clearPollingContent, pollingContent } = usePollingStore()
  const [previewPost, setPreviewPost] = useState<PollingPostType | ContestPostType | TournamentPostType | null>(null)
  const [isOnPreview, setIsOnPreview] = useState(false)
  const [savePostForLogin, setSavePostForLogin] = useState<NewPostType | null>(null)
  const info = newPost?.info

  const { mutate } = useMutation({
    mutationKey: ["homePosts"],
    mutationFn: (newPost: { [key: string]: any }) => posting(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homePosts"] }) // 캐시를 지우고
      queryClient.refetchQueries({ queryKey: ["homePosts"] }) // 다시 호출
      router.push("/") // todo
      toast.success(successMessage["posting"], successToastOptions("posting"))
      clearNewPost()
      clearContestContent()
      clearPollingContent()
      clearTournamentContent()
      setModal("none")
      localStorage.removeItem("favorite_save_data")
    },
  })

  const sendNewPostError = (type: ErrorTypes) => {
    setError({ type, text: errorMessage[type] })
    toast.error(errorMessage[type], errorToastOptions)
    setTimeout(() => {
      setError({ type: "clear" })
    }, 3000)
    setStatus("edit")
  }

  const onClickOption = (option: PostOptionType) => {
    setNewPost({ type: "option", payload: option })
  }

  const preview = (post: NewPostType) => {
    const obj = {
      ...post,
      format: "preview",
      postId: "preview",
      user: userData?.user,
      comments: [],
      createdAt: new Date(),
    }
    switch (post.type) {
      case "polling":
        obj.content.candidates = obj.content.candidates.map((v: PollingCandidateType) => ({
          ...v,
          count: randomNum(20, 100),
        }))
        setPreviewPost({
          ...obj,
          type: "polling",
        } as PollingPostType)
        break

      case "contest":
        obj.content.left.count = randomNum(20, 100)
        obj.content.right.count = randomNum(20, 100)
        setPreviewPost({
          ...obj,
          type: "contest",
        } as ContestPostType)
        break

      case "tournament":
        obj.content.candidates = obj.content.candidates.map((v: TournamentCandidateType) => ({
          ...v,
          win: randomNum(20, 100),
          lose: randomNum(20, 100),
          pick: randomNum(0, 20),
        }))
        setPreviewPost({
          ...obj,
          type: "tournament",
        } as TournamentPostType)
        break

      default:
        break
    }

    setIsOnPreview(true)
  }

  const validate = async (type: "preview" | "posting") => {
    if (!newPost) return sendNewPostError("unknown")
    if (!newPost.type) return sendNewPostError("unknown")
    const _post = cloneDeep(newPost)

    if (_post.title.trim().length < 3) return sendNewPostError("postTitle")

    switch (newPost.type) {
      case "polling":
        const { candidates, chartDescription, layout } = pollingContent
        if (candidates.length < 2) return sendNewPostError("candidateLength")
        if (!candidates.every(({ title }) => !!title.trim())) return sendNewPostError("noCandidateTitle")
        _post.content = {
          chartDescription,
          layout,
          candidates: candidates.map((v, i) => ({ ...v, number: i + 1 })),
        }
        break
      case "contest":
        const { left, right } = contestContent
        if (!left.imageSrc?.trim() || !right.imageSrc?.trim()) return sendNewPostError("noCandidateImage")
        if (!left.title?.trim() || !right.title?.trim()) return sendNewPostError("noCandidateTitle")
        _post.content = cloneDeep(contestContent)
        break
      case "tournament":
        const { candidates: tournamentCandidates } = tournamentContent
        if (tournamentCandidates.length < 2) return sendNewPostError("candidateLength")
        if (!tournamentCandidates.every(({ title }) => !!title.trim())) return sendNewPostError("noCandidateTitle")
        if (!tournamentCandidates.every(({ imageSrc }) => !!imageSrc.trim()))
          return sendNewPostError("noCandidateImage")
        _post.content = cloneDeep(tournamentContent)
        break
    }

    if (type === "preview") {
      preview(_post)
    } else {
      if (userData) {
        if (!userData.user) {
          setSavePostForLogin(_post)
          toast.success(successMessage["loginNewPost"], successToastOptions("loginNewPost"))
          setModal("loginNewPost")
        } else {
          mutate({ ..._post, userId: userData.user.userId, postId: nanoid(10) })
        }
      }
    }
  }
  useEffect(() => {
    if (userData?.user?.userId && savePostForLogin && modalStatus === "newPostLoginSuccess") {
      mutate({ ...savePostForLogin, userId: userData?.user?.userId, postId: nanoid(10) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savePostForLogin, modalStatus, userData])

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
          <div className={cx(style.option, { [style.active]: info?.isNoComments })}>
            <span>댓글 비활성화</span>
            <button onClick={() => onClickOption("isNoComments")} className={cx(style.bar)}>
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
