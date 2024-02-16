"use client"

import { getUser } from "@/_queries/user"

import { PostOptionType, ThumbnailType, useNewPostStore } from "@/_store/newPost"
import { UserType } from "@/_types/user"
import { useQuery } from "@tanstack/react-query"

import NoThumbnail from "@/_components/Loading/NoThumbnail"
import { createNewPost, uploadImage } from "@/_queries/newPost"
import { usePollingStore } from "@/_store/newPost/polling"
import classNames from "classnames"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import "./style.scss"

const selectorTypes = [
  { type: "custom", children: <i className="fa-solid fa-image"></i>, label: "커스텀 썸네일" },
  {
    type: "layout",
    children: <i className="fa-solid fa-film"></i>,
    label: "콘텐츠 레이아웃",
  },
  { type: "none", children: <i className="fa-solid fa-close"></i>, label: "썸네일 없음" },
]

export default function RendingSection() {
  const { data: user } = useQuery<UserType>({
    queryKey: ["getUser"],
    queryFn: () => getUser(1),
  })
  const router = useRouter()
  const { newPost, setNewPost, setStatus } = useNewPostStore()
  const { setSelectedCandidate, newCandidates, clearCandidate } = usePollingStore()

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
    const { title } = newPost

    if (title.trim().length < 3) return alert("타이틀은 공백을 제외하고 3글자 이상으로 작성해주세요!")
    if (!user) return alert("로그인이 필요해요")
    if (newCandidates.length < 2) return alert("후보는 적어도 2개 이상 필요해요")
    if (!newCandidates.every(({ title }) => !!title.trim())) return alert("타이틀이 없는 후보가 존재해요")

    if (type === "preview") {
      router.push("/post/preview")
    } else {
      await createNewPost(newPost).then(() => {
        setSelectedCandidate(null)
        setStatus("init")
        clearCandidate()
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

  return (
    user && (
      <div className="rending">
        <section className="rending-section">
          <h1>썸네일 변경</h1>
          <div className="thumbnail-edit">
            {thumbnailType === "custom" && (
              <div
                style={{
                  background: `url('${newPost?.thumbnail}') center / cover`,
                }}
                className={classNames("thumbnail custom", { active: isDragActive })}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <i className={classNames("fa-solid fa-plus", { active: isDragActive })} />
              </div>
            )}
            {thumbnailType === "layout" && (
              <div className="thumbnail layout">
                {newCandidates.slice(0, 5).map(({ listId, imageSrc }) => (
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
            {thumbnailType === "none" && <NoThumbnail type="postCard" />}
            <div className="thumbnail-selector">
              {selectorTypes.map(({ type, children, label }) => (
                <button
                  key={type}
                  onClick={() => onChangeThumbnailStyle(type as ThumbnailType)}
                  className={classNames({ active: thumbnailType === type })}
                >
                  <div className={`preview`}>{children}</div>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
        <div className="finish">
          <div className={classNames("option", { active: newPost?.format === "secret" })}>
            <span>비공개 콘텐츠</span>
            <button onClick={() => onClickOption("isSecret")} className="bar">
              <div className="circle"></div>
            </button>
          </div>
          <div className={classNames("option", { active: info?.isNoComments })}>
            <span>댓글 비활성화</span>
            <button onClick={() => onClickOption("isNoComments")} className="bar">
              <div className="circle"></div>
            </button>
          </div>
          <div className="btn-wrapper">
            <button onClick={() => create("preview")}>미리 플레이 해보기</button>
            <button onClick={() => create("posting")}>포스팅 하기</button>
          </div>
        </div>
      </div>
    )
  )
}
