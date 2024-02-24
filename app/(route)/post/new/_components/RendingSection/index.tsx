"use client"

import { getUser } from "@/_queries/user"
import { cloneDeep } from "lodash"

import { useNewPostStore } from "@/_store/newPost"
import { UserType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"

import NoThumbnail from "@/_components/Loading/NoThumbnail"
import { createNewPost, uploadImage } from "@/_queries/newPost"
import { useContestStore } from "@/_store/newPost/contest"
import { usePollingStore } from "@/_store/newPost/polling"
import { PostOptionType, ThumbnailType } from "@/_types/post/post"
import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import { useDropzone } from "react-dropzone"

import ContestPost from "@/(route)/post/contest/[postId]/_components"
import PollingPost from "@/(route)/post/polling/[postId]/_components"
import TournamentPost from "@/(route)/post/tournament/[postId]/_components"
import { errorMessage } from "@/_data/message"
import { errorToastOptions } from "@/_data/toast"
import { useTournamentStore } from "@/_store/newPost/tournament"
import { ErrorTypes } from "@/_types"
import { ContestPostType } from "@/_types/post/contest"
import { PollingCandidateType, PollingPostType } from "@/_types/post/polling"
import { TournamentCandidateType, TournamentPostType } from "@/_types/post/tournament"
import { randomNum } from "@/_utils/math"
import classNames from "classNames"
import { toast } from "react-toastify"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const selectorTypes = [
  { type: "custom", children: <i className={cx("fa-solid", "fa-image")}></i>, label: "커스텀 썸네일" },
  {
    type: "layout",
    children: <i className={cx("fa-solid", "fa-film")}></i>,
    label: "콘텐츠 레이아웃",
  },
  { type: "none", children: <i className={cx("fa-solid", "fa-close")}></i>, label: "썸네일 없음" },
]

export default function RendingSection() {
  const { data: user } = useQuery<UserType>({
    queryKey: ["getUser", "edit"],
    queryFn: () => getUser(1),
    select: ({ userId, userName, userImage }) => ({ userId, userName, userImage }), // 여기서 data는 전체 데이터 객체입니다.
  })

  const router = useRouter()
  const { newPost, setNewPost, clearNewPost, setStatus, setError } = useNewPostStore()
  const { contestContent, clearContestContent } = useContestStore()
  const { tournamentContent, clearTournamentContent } = useTournamentStore()
  const { pollingContent, clearPollingContent } = usePollingStore()
  const [previewPost, setPreviewPost] = useState<PollingPostType | ContestPostType | TournamentPostType | null>(null)
  const [isOnPreview, setIsOnPreview] = useState(false)

  const sendNewPostError = (type: ErrorTypes) => {
    setError({ type, text: errorMessage[type] })
    toast.error(errorMessage[type], errorToastOptions)
    setTimeout(() => {
      setError({ type: "clear" })
    }, 3000)
    setStatus("edit")
  }

  const onChangeThumbnailStyle = (type: ThumbnailType) => {
    setNewPost({ type: "thumbnailType", payload: type })
  }
  const onClickOption = (option: PostOptionType) => {
    setNewPost({ type: "option", payload: option })
  }

  const create = async (type: "preview" | "posting") => {
    if (!newPost) return sendNewPostError("unknown")
    if (!newPost.type) return sendNewPostError("unknown")
    const _post = cloneDeep(newPost)

    if (_post.title.trim().length < 3) return sendNewPostError("postTitle")
    if (!user) return sendNewPostError("login")

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
      const obj = {
        ..._post,
        format: "preview",
        postId: "preview",
        user,
        comments: [],
        createdAt: new Date(),
      }
      switch (_post.type) {
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
          console.log(obj)

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
    } else {
      await createNewPost(_post).then(() => {
        clearNewPost()
        clearContestContent()
        clearPollingContent()
        clearTournamentContent()
        router.push(`/`)
      })
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: any) => {
        const formData = new FormData()
        formData.append("image", file)

        const { msg, imageSrc } = await uploadImage(formData)
        if (msg === "ok") {
          setNewPost({ type: "thumbnail", payload: imageSrc })
          setNewPost({ type: "thumbnailType", payload: "custom" })
        }
      })
    },
    [setNewPost]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
  })

  const thumbnailType = newPost?.info.thumbnailType
  const info = newPost?.info
  const layoutImages = useMemo(() => {
    switch (newPost?.type) {
      case "polling":
        return pollingContent.candidates.slice(0, 5)
      case "contest":
        return [contestContent.left, contestContent.right]
      case "tournament":
        return tournamentContent.candidates.slice(0, 5)
      default:
        return []
    }
  }, [
    contestContent.left,
    contestContent.right,
    newPost?.type,
    pollingContent.candidates,
    tournamentContent.candidates,
  ])

  return (
    <>
      {user && (
        <div className={cx(style.rending)}>
          <section className={cx(style["rending-section"])}>
            <h1>썸네일 변경</h1>
            <div className={cx(style["thumbnail-styler"])}>
              {thumbnailType === "custom" && (
                <div
                  style={{
                    background: `url('${newPost?.thumbnail}') center / cover`,
                  }}
                  className={cx(style.thumbnail, style.custom, { [style.active]: isDragActive })}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <i className={cx("fa-solid", "fa-plus", { [style.active]: isDragActive })} />
                </div>
              )}
              {thumbnailType === "layout" && (
                <div className={cx(style.thumbnail, style.layout)}>
                  {layoutImages.slice(0, 5).map(({ listId, imageSrc }) => (
                    <div
                      key={`thumb_${listId}`}
                      style={{
                        backgroundImage: `url('${imageSrc}'), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDEOaqDXtUswwG_M29-z0hIYG-YQqUPBUidpFBHv6g60GgpYq2VQesjbpmVVu8kfd-pw&usqp=CAU')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ))}
                </div>
              )}
              {thumbnailType === "none" && <NoThumbnail type="post-card" />}
              <div className={cx(style["thumbnail-selector"])}>
                {selectorTypes.map(({ type, children, label }) => (
                  <button
                    key={type}
                    onClick={() => onChangeThumbnailStyle(type as ThumbnailType)}
                    className={cx({ [style.active]: thumbnailType === type })}
                  >
                    <div className={cx(style["preview-icon"])}>{children}</div>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
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
              <button onClick={() => create("preview")}>미리 플레이 해보기</button>
              <button onClick={() => create("posting")}>포스팅 하기</button>
            </div>
          </div>
        </div>
      )}
      {previewPost && isOnPreview && (
        <div className={cx(style.preview, { [style.visible]: setIsOnPreview })}>
          <div className={cx(style["preview-back"])}>
            <button onClick={() => setIsOnPreview(false)}>
              <i className={cx("fa-solid", "fa-close")}></i>
            </button>
          </div>
          {previewPost.type === "polling" && <PollingPost post={previewPost as PollingPostType} />}
          {previewPost.type === "contest" && <ContestPost post={previewPost as ContestPostType} />}
          {previewPost.type === "tournament" && <TournamentPost post={previewPost as TournamentPostType} />}

          <div className={cx(style["preview-triangle"])}></div>
          <span className={cx(style["preview-label"])}>PREVIEW</span>
        </div>
      )}
    </>
  )
}
