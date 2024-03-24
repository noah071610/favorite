import { API } from "@/_data"
import { NewPostStates } from "@/_store/newPost"
import { LangType } from "@/_types"
import { PostType } from "@/_types/post"
import { randomNum } from "@/_utils/math"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function uploadImage(file: FormData) {
  if (process.env.NODE_ENV !== "production") {
    return {
      msg: "ok",
      data: `https://picsum.photos/id/${randomNum(100, 500)}/500/300`,
    }
  } else {
    const response = await API.post(`/upload`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  }
}

export async function posting(newPost: NewPostStates) {
  const response = await API.post(`/post`, newPost)
  return response.data.data
}

export async function copyPost(newPost: PostType) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
  if (cookie) {
    const response = await API.post(`/post/copy`, newPost)
    return response.data.data
  }
}

export async function savePost(saveData: NewPostStates) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
  if (cookie) {
    const response = await API.post(`/post/save`, saveData)

    return response.data.data
  }
}

export async function getSavePost(postId: string) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
  if (cookie) {
    const response = await API.get(`/post/save?postId=${postId}`)
    return response.data.data
  }
}

export async function initNewPost(lang: LangType) {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
  if (cookie) {
    const response = await API.post(`/post/init?lang=${lang}`)
    return response.data.data
  }
}

export async function deletePost(postId: string) {
  await API.delete(`/post?postId=${postId}`)
  return { msg: "ok" }
}
