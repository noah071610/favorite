import { useNewPostStore } from "@/_store/newPost"

import React from "react"

export const InfoInput = React.memo(() => {
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
          className={"title-input"}
          placeholder="제목 입력"
          value={newPost.title ?? ""}
          onChange={(e) => onChangeInput(e, "title")}
        />
        <input
          className={"description-input"}
          placeholder="설명 입력"
          value={newPost.description ?? ""}
          onChange={(e) => onChangeInput(e, "description")}
        />
      </>
    )
  )
})
InfoInput.displayName = "NewPostInput"
