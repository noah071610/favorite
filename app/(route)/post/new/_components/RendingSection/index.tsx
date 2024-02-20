"use client"

import { getUser } from "@/_queries/user"

import { useNewPostStore } from "@/_store/newPost"
import { UserType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"

import NoThumbnail from "@/_components/Loading/NoThumbnail"
import { createNewPost, uploadImage } from "@/_queries/newPost"
import { useContestTypeStore } from "@/_store/newPost/contest"
import { usePollingStore } from "@/_store/newPost/polling"
import { PostOptionType, ThumbnailType } from "@/_types/post/post"
import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import { useDropzone } from "react-dropzone"

import ContestPostPage from "@/(route)/post/contest/[postId]/page"
import PollingPostPage from "@/(route)/post/polling/[postId]/page"
import { useTournamentStore } from "@/_store/newPost/tournament"
import { ContestPostType } from "@/_types/post/contest"
import { PollingCandidateType, PollingPostType } from "@/_types/post/polling"
import { TournamentCandidateType, TournamentPostType } from "@/_types/post/tournament"
import { randomNum } from "@/_utils/math"
import classNames from "classNames"
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
  const { newPost, setNewPost, clearNewPost } = useNewPostStore()
  const { leftCandidate, rightCandidate, clearContestContent } = useContestTypeStore()
  const { tournamentCandidates, clearTournamentContent } = useTournamentStore()
  const { pollingCandidates, clearPollingContent, chartDescription, layoutType } = usePollingStore()
  const [previewPost, setPreviewPost] = useState<PollingPostType | ContestPostType | TournamentPostType | null>(null)
  const [isOnPreview, setIsOnPreview] = useState(false)

  const onChangeThumbnailStyle = (type: ThumbnailType) => {
    setNewPost({ type: "thumbnailType", payload: type })
  }
  const onClickOption = (option: PostOptionType) => {
    setNewPost({ type: "option", payload: option })
  }

  const create = async (type: "preview" | "posting") => {
    if (!newPost) {
      return alert("에러 발생")
    }
    const _post = { ...newPost }

    if (_post.title.trim().length < 3) return alert("타이틀은 공백을 제외하고 3글자 이상으로 작성해주세요!")
    if (!user) return alert("로그인이 필요해요")

    switch (newPost?.type) {
      case "polling":
        if (pollingCandidates.length < 2) return alert("후보는 적어도 2개 이상 필요해요")
        if (!pollingCandidates.every(({ title }) => !!title.trim())) return alert("타이틀이 없는 후보가 존재해요")
        _post.content = {
          chartDescription,
          layout: layoutType,
          candidates: pollingCandidates.map((v) => ({ ...v, count: 0 })),
        }
        break
      case "contest":
        if (!leftCandidate?.imageSrc?.trim()) return alert("왼쪽 후보의 이미지가 필요해요")
        if (!rightCandidate?.imageSrc?.trim()) return alert("오른쪽 후보의 이미지가 필요해요")
        if (!leftCandidate?.title?.trim()) return alert("왼쪽 후보의 타이틀을 입력해주세요")
        if (!rightCandidate?.title?.trim()) return alert("오른쪽 후보의 타이틀을 입력해주세요")
        _post.content = {
          left: {
            ...leftCandidate,
            count: 0,
          },
          right: {
            ...rightCandidate,
            count: 0,
          },
        }
        break
      case "tournament":
        if (tournamentCandidates.length < 2) return alert("후보는 적어도 2개 이상 필요해요")
        if (!tournamentCandidates.every(({ title }) => !!title.trim())) return alert("타이틀이 없는 후보가 존재해요")
        if (!tournamentCandidates.every(({ imageSrc }) => !!imageSrc.trim()))
          return alert("이미지가 없는 후보가 존재해요")
        _post.content = {
          candidates: tournamentCandidates,
        }
        break
    }

    if (type === "preview") {
      const { userId, ...rest } = _post
      const obj = {
        ...rest,
        format: "preview",
        postId: "preview",
        user,
        comments: [],
        createdAt: new Date(),
      }
      switch (_post.type) {
        case "polling":
          _post.content.candidates = _post.content.candidates.map((v: PollingCandidateType) => ({
            ...v,
            count: randomNum(20, 100),
          }))
          setPreviewPost({
            ...obj,
            type: "polling",
          } as PollingPostType)
          break

        case "contest":
          _post.content.left.count = randomNum(20, 100)
          _post.content.right.count = randomNum(20, 100)
          setPreviewPost({
            ...obj,
            type: "contest",
          } as ContestPostType)
          break

        case "tournament":
          _post.content.candidates = _post.content.candidates.map((v: TournamentCandidateType) => ({
            ...v,
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
        return pollingCandidates
      case "contest":
        return [leftCandidate, rightCandidate]
      case "tournament":
        return tournamentCandidates
      default:
        return []
    }
  }, [newPost?.type, pollingCandidates, leftCandidate, rightCandidate, tournamentCandidates])

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
          {previewPost.type === "polling" && <PollingPostPage previewPost={previewPost as PollingPostType} />}
          {previewPost.type === "contest" && <ContestPostPage previewPost={previewPost as ContestPostType} />}

          <div className={cx(style["preview-triangle"])}></div>
          <span className={cx(style["preview-label"])}>PREVIEW</span>
        </div>
      )}
    </>
  )
}
