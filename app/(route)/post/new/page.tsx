"use client"

import React, { useCallback, useEffect } from "react"

import "@/(route)/post/[postId]/style.scss"
import "./style.scss"

import { getUser } from "@/_queries/user"
import { useQuery } from "@tanstack/react-query"

import { CandidateDisplayType, useNewPostStore } from "@/_store/newPost"
import { UserType } from "@/_types/post"
import classNames from "classnames"
import { nanoid } from "nanoid"

import { uploadImage } from "@/_queries/newPost"
import { useDropzone } from "react-dropzone"
import ChartPart from "../[postId]/_components/Chartpart"
import CandidateList from "./_components/CandidateList"
import InitEditSection from "./_components/InitEditSection"
import Rending from "./_components/Rending"
import VotingPart from "./_components/VotingPart"

const NewPostInput = React.memo(() => {
  const { newPost, setNewPost, section } = useNewPostStore()
  const onChangeInput = (e: any, type: "title" | "description") => {
    if (type === "title" && e.target.value.length >= 60) return
    if (type === "description" && e.target.value.length >= 80) return

    setNewPost({ [type]: e.target.value })
  }
  return (
    newPost && (
      <>
        <input
          className="title-input"
          placeholder="제목 입력"
          value={newPost.title ?? ""}
          onChange={(e) => onChangeInput(e, "title")}
        />
        <input
          className="description-input"
          placeholder="설명 입력"
          value={newPost.description ?? ""}
          onChange={(e) => onChangeInput(e, "description")}
        />
      </>
    )
  )
})
NewPostInput.displayName = "NewPostInput"

export default function NewPost() {
  const { data: user } = useQuery<UserType>({
    queryKey: ["getUser"],
    queryFn: () => getUser(1),
  })
  const { newPost, newCandidates, section, setNewPost, candidateDisplayType, setCandidateDisplayType } =
    useNewPostStore()

  const onChangeCandidateLayout = (style: CandidateDisplayType) => {
    setCandidateDisplayType(style)
  }

  useEffect(() => {
    // todo: 불러오기 로직 추가
    setNewPost({
      postId: nanoid(10),
      type: "vote-textImage",
      title: "",
      description: "",
      chartDescription: "",
      thumbnail: "",
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    <div className={classNames("post-page new-post-page", { isResultPage: section === "result" })}>
      <div className="post">
        {/* INIT SECTION */}
        {section === "init" && <InitEditSection />}

        {/* CANDIDATE LAYOUT FOR EDIT SECTION */}
        {section === "edit" && (
          <>
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
            <section className="candidate-style-edit">
              <h1>후보 스타일 변경</h1>
              <div className="inner">
                <button
                  onClick={() => onChangeCandidateLayout("textImage")}
                  className={classNames("card", { active: candidateDisplayType === "textImage" })}
                >
                  <div className="icon-wrapper">
                    <i className="fa-solid fa-heading" />
                    <i className="fa-solid fa-plus" />
                    <i className="fa-solid fa-image" />
                  </div>
                  <span>이미지와 텍스트</span>
                </button>
                <button
                  onClick={() => onChangeCandidateLayout("image")}
                  className={classNames("card", { active: candidateDisplayType === "image" })}
                >
                  <div className="icon-wrapper">
                    <i className="fa-solid fa-image" />
                  </div>
                  <span>이미지 중심</span>
                </button>
                <button
                  onClick={() => onChangeCandidateLayout("text")}
                  className={classNames("card", { active: candidateDisplayType === "text" })}
                >
                  <div className="icon-wrapper">
                    <i className="fa-solid fa-heading" />
                  </div>
                  <span>텍스트만</span>
                </button>
              </div>
            </section>
          </>
        )}

        {/* EDIT & RESULT SECTION */}
        {(section === "edit" || section === "result") && (
          <>
            <section className="info">
              <div className="title">
                {section === "edit" && newPost && <NewPostInput />}
                {section === "result" && newPost && (
                  <>
                    <h1>{!!newPost.title.trim() ? newPost.title : "제목 입력"}</h1>
                    <h2>{!!newPost.description.trim() ? newPost.description : "설명 입력"}</h2>
                  </>
                )}
              </div>
              <div className="profile">
                <button className="user-image">
                  <img src={user?.userImage} alt={`user_image_${user?.userId}`} />
                </button>
                <div className="user-info">
                  <span>{user?.userName}</span>
                  <span>2024/01/13</span>
                </div>
              </div>
            </section>
            <div className={classNames("content", { ["result-page"]: section === "result" })}>
              <div className="left">
                <CandidateList />
              </div>
              <div className="right">
                {section === "edit" && <VotingPart />}
                {section === "result" && <ChartPart candidates={newCandidates} isEdit={true} />}
              </div>
            </div>
          </>
        )}

        {/* RENDING SECTION */}
        {section === "rending" && <Rending />}
      </div>
    </div>
  )
}
