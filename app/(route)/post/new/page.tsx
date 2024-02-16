"use client"

import React, { useEffect } from "react"

import "@/(route)/post/[postId]/style.scss"
import "./style.scss"

import { getUser } from "@/_queries/user"
import { useQuery } from "@tanstack/react-query"

import { PollingLayoutType, useNewPostStore } from "@/_store/newPost"
import { UserType } from "@/_types/post"
import classNames from "classnames"
import { nanoid } from "nanoid"

import ContestContent from "./_components/@Contest"
import PollingContent from "./_components/@Polling"
import InitSection from "./_components/InitSection"
import RendingSection from "./_components/RendingSection"

const selectorTypes = [
  { value: "textImage", icons: ["fa-heading", "fa-plus", "fa-image"], label: "이미지와 텍스트" },
  { value: "image", icons: ["fa-image"], label: "이미지 중심" },
  { value: "text", icons: ["fa-heading"], label: "텍스트만" },
]

const NewPostInput = React.memo(() => {
  const { newPost, setNewPost } = useNewPostStore()
  const onChangeInput = (e: any, type: "title" | "description") => {
    if (type === "title" && e.target.value.length >= 60) return
    if (type === "description" && e.target.value.length >= 80) return

    setNewPost({ type, payload: e.target.value })
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

export default function NewPostPage() {
  const { data: user } = useQuery<UserType>({
    queryKey: ["getUser"],
    queryFn: () => getUser(1),
  })
  const { newPost, newPostStatus, setNewPost, createNewPost } = useNewPostStore()

  const onChangeCandidateLayout = (style: PollingLayoutType) => {
    setNewPost({ type: "layout", payload: style })
  }

  useEffect(() => {
    // todo: 불러오기 로직 추가
    if (!newPost && user) {
      createNewPost({
        postId: nanoid(10),
        type: null,
        thumbnail: "",
        title: "",
        description: "",
        format: "default",
        user,
        info: {
          participateImages: [],
          shareCount: 0,
          like: 0,
          participateCount: 0,
          isNoComments: 0,
          thumbnailType: "custom",
        },
        content: {
          chartDescription: "",
          layout: "textImage",
          candidates: [],
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, newPost])

  return (
    <>
      <div className={classNames("post-page new-post-page", { isInit: newPostStatus === "init" })}>
        <div className="post">
          {/* INIT SECTION */}
          {newPostStatus === "init" && <InitSection />}

          {/* CANDIDATE LAYOUT FOR EDIT SECTION */}
          {newPostStatus === "edit" && (
            <>
              {newPost?.type === "polling" && (
                <section className="candidate-style-edit">
                  <h1>후보 스타일 변경</h1>
                  <div className="inner">
                    {selectorTypes.map(({ value, icons, label }) => (
                      <button
                        key={value}
                        onClick={() => onChangeCandidateLayout(value as PollingLayoutType)}
                        className={classNames("card", { active: newPost?.content.layout === value })}
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
          {(newPostStatus === "edit" || newPostStatus === "result") && (
            <>
              <section className="info">
                <div className="title">
                  {newPostStatus === "edit" && newPost && <NewPostInput />}
                  {newPostStatus === "result" && newPost && (
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
              {newPost?.type === "polling" && <PollingContent />}
              {newPost?.type === "contest" && <ContestContent />}
            </>
          )}

          {/* RENDING SECTION */}
          {newPostStatus === "rending" && <RendingSection />}
        </div>
      </div>
    </>
  )
}
