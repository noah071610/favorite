"use client"

import React, { useEffect } from "react"

import "@/(route)/post/[postId]/style.scss"
import "./style.scss"

import { getUser } from "@/_queries/user"
import { useQuery } from "@tanstack/react-query"

import { CandidateDisplayType, useNewPostStore } from "@/_store/newPost"
import { UserType } from "@/_types/post"
import classNames from "classnames"
import { nanoid } from "nanoid"

import InitEditSection from "./_components/InitEditSection"
import RendingSection from "./_components/RendingSection"
import VoteTypeContent from "./_components/VoteType"
import VsTypeContent from "./_components/VsType"

const selectorTypes = [
  { type: "textImage", icons: ["fa-heading", "fa-plus", "fa-image"], label: "이미지와 텍스트" },
  { type: "image", icons: ["fa-image"], label: "이미지 중심" },
  { type: "text", icons: ["fa-heading"], label: "텍스트만" },
]

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
      type: "",
      title: "",
      description: "",
      chartDescription: "",
      thumbnail: "",
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={classNames("post-page new-post-page", { isInit: section === "init" })}>
      <div className="post">
        {/* INIT SECTION */}
        {section === "init" && <InitEditSection />}

        {/* CANDIDATE LAYOUT FOR EDIT SECTION */}
        {section === "edit" && (
          <>
            {newPost?.type.includes("vote") && (
              <section className="candidate-style-edit">
                <h1>후보 스타일 변경</h1>
                <div className="inner">
                  {selectorTypes.map(({ type, icons, label }) => (
                    <button
                      key={type}
                      onClick={() => onChangeCandidateLayout(type as CandidateDisplayType)}
                      className={classNames("card", { active: candidateDisplayType === type })}
                    >
                      <div className="icon-wrapper">
                        {icons.map((icon, index) => (
                          <i key={index} className={`fa-solid ${icon}`} />
                        ))}
                      </div>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
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
            {newPost?.type === "vote" && <VoteTypeContent />}
            {newPost?.type === "vs" && <VsTypeContent />}
          </>
        )}

        {/* RENDING SECTION */}
        {section === "rending" && <RendingSection />}
      </div>
    </div>
  )
}
