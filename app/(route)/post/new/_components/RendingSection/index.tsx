"use client"

import { getUser } from "@/_queries/user"

import { useNewPostStore } from "@/_store/newPost"
import { UserType } from "@/_types/post"
import { useQuery } from "@tanstack/react-query"

import PostCard from "@/_components/PostCard"
import { createNewPost, uploadImage } from "@/_queries/newPost"
import classNames from "classnames"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import "./style.scss"

export default function RendingSection() {
  const { data: user } = useQuery<UserType>({
    queryKey: ["getUser"],
    queryFn: () => getUser(1),
  })
  const router = useRouter()
  const { newPost, newCandidates, setSelectedCandidate, setNewPost, setSection, clearCandidate, candidateDisplayType } =
    useNewPostStore()

  const posting = async () => {
    if (!newPost) {
      return alert("에러 발생")
    }
    const { title } = newPost

    if (title.trim().length < 3) return alert("타이틀은 공백을 제외하고 3글자 이상으로 작성해주세요!")
    if (!user) return alert("로그인이 필요해요")
    if (newCandidates.length < 2) return alert("후보는 적어도 2개 이상 필요해요")
    if (!newCandidates.every(({ title }) => !!title.trim())) return alert("타이틀이 없는 후보가 존재해요")

    await createNewPost({
      ...newPost,
      type: newPost.type === "vote" ? `vote-${candidateDisplayType}` : newPost.type,
      userId: user.userId,
      info: {
        like: 0,
        participateCount: 0,
        participateImages: [],
        shareCount: 0,
      },
      content: newCandidates.map((v) => ({ ...v, count: 0 })),
    }).then(() => {
      setSelectedCandidate(null)
      setSection("init")
      setNewPost(null)
      clearCandidate()
      router.push(`/`)
    })
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: any) => {
        const formData = new FormData()
        formData.append("image", file)

        const { msg, imageSrc } = await uploadImage(formData)
        if (msg === "ok") {
          setNewPost({ thumbnail: imageSrc })
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

  return (
    user && (
      <div className="rending">
        <section className="thumbnail-edit">
          <h1>썸네일 변경</h1>
          <div
            style={{
              background: `url('${newPost?.thumbnail}') center / cover`,
            }}
            className={classNames("thumbnail", { active: isDragActive })}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <i className={classNames("fa-solid fa-plus", { active: isDragActive })} />
          </div>
        </section>
        <div className="rending-content">
          {newPost && (
            <div className="card-preview">
              <PostCard
                isEdit={true}
                postCard={{
                  ...newPost,
                  title: newPost.title.trim() ? newPost.title : "제목은 필수 입력이에요!",
                  user,
                  type: newPost?.type === "vote" ? `vote-${candidateDisplayType}` : newPost?.type,
                  info: {
                    like: 0,
                    participateCount: 0,
                    participateImages: [],
                    shareCount: 0,
                  },
                }}
              />
            </div>
          )}
          <div className="finish">
            <div className="btn-wrapper">
              <button>미리 플레이 해보기</button>
              <button onClick={posting}>포스팅 하기</button>
            </div>
          </div>
        </div>
      </div>
    )
  )
}
