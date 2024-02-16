"use client"

import { useNewPostStore } from "@/_store/newPost"
import { PollingPostType } from "@/_types/post/post"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import PostPage from "../[postId]/page"

export default function PostPreviewPage() {
  const { newPost } = useNewPostStore()
  const { back } = useRouter()
  useEffect(() => {
    if (!newPost) {
      back()
    }
  }, [newPost])

  return newPost && <PostPage previewPost={{ ...newPost, createdAt: new Date(), comments: [] } as PollingPostType} />
}
