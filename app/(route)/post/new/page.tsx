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

import { uploadImage } from "@/_queries/post"
import { useDropzone } from "react-dropzone"
import ChartPart from "../[postId]/_components/Chartpart"
import CandidateList from "./_components/CandidateList"
import InitEditSection from "./_components/InitEditSection"
import RendingEditSection from "./_components/RendingEditSection"
import VotingEditSection from "./_components/VotingEditSection"

const NewPostInput = React.memo(() => {
  const { newPost, setNewPost } = useNewPostStore()
  const onChangeInput = (e: any, type: "title" | "description") => {
    if (type === "title" && e.target.value.length >= 60) return
    if (type === "description" && e.target.value.length >= 80) return

    setNewPost({ [type]: e.target.value })
  }
  return (
    newPost && (
      <>
        <input
          className="post-title-input"
          placeholder="제목 입력"
          value={newPost.title ?? ""}
          onChange={(e) => onChangeInput(e, "title")}
        />
        <input
          className="post-description-input"
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
    <div className={classNames("post-page new-post-page")}>
      <div className="post">
        {/* INIT SECTION */}
        {section === "init" && <InitEditSection />}

        {/* CANDIDATE LAYOUT FOR EDIT SECTION */}
        {section === "edit" && (
          <>
            <section className="edit-wrapper thumbnail-wrapper">
              <h1>썸네일 변경</h1>
              <div
                style={{
                  background: `url('${newPost?.thumbnail}') center / cover`,
                }}
                className={classNames("thumbnail-image", { active: isDragActive })}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <i className={classNames("fa-solid fa-plus", { active: isDragActive })} />
              </div>
            </section>
            <section className="edit-wrapper layout-selector-wrapper">
              <h1>후보 스타일 변경</h1>
              <div className="layout-selector-inner">
                <button
                  onClick={() => onChangeCandidateLayout("textImage")}
                  className={classNames("layout-selector", { active: candidateDisplayType === "textImage" })}
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
                  className={classNames("layout-selector", { active: candidateDisplayType === "image" })}
                >
                  <div className="icon-wrapper">
                    <i className="fa-solid fa-image" />
                  </div>
                  <span>이미지 중심</span>
                </button>
                <button
                  onClick={() => onChangeCandidateLayout("text")}
                  className={classNames("layout-selector", { active: candidateDisplayType === "text" })}
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
            <section className="post-info">
              <div className="post-info-title">
                {section === "edit" && newPost && <NewPostInput />}
                {section === "result" && newPost && (
                  <>
                    <h1>{!!newPost.title.trim() ? newPost.title : "제목 입력"}</h1>
                    <p>{!!newPost.description.trim() ? newPost.description : "설명 입력"}</p>
                  </>
                )}
              </div>
              <div className="post-info-profile">
                <button className="user-image">
                  <img src={user?.userImage} alt={`user_image_${user?.userId}`} />
                </button>
                <div>
                  <h3>{user?.userName}</h3>
                  <span>작성일: 2024/01/13</span>
                </div>
              </div>
            </section>
            <div className={classNames("post-content", { ["result-page"]: section === "result" })}>
              <section className="left">
                <CandidateList />
              </section>
              <section className="right">
                {section === "edit" && <VotingEditSection />}
                {section === "result" && <ChartPart candidates={newCandidates} isEdit={true} />}
              </section>
            </div>
          </>
        )}

        {/* RENDING SECTION */}
        {section === "rending" && <RendingEditSection />}
      </div>
    </div>
  )
}
