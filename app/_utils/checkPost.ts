import { NewPostType } from "@/_types/post/post"

export default function checkPost(post: NewPostType): { msg: "ok" | "no"; error?: string } {
  if (!post.type) return { msg: "no", error: "unknown" }
  return { msg: "ok" }
}
