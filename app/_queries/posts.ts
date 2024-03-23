import { API } from "@/_data"
import { LangType } from "@/_types"
import { ContentPageParams, PostFindQuery } from "@/_types/post"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function getPosts({ cursor = "0", query = "all", sort = "createdAt", lang = "ko" }: ContentPageParams) {
  const response = await API.get(
    `/posts?cursor=${cursor ?? "0"}&query=${query ?? "all"}&sort=${sort ?? "createdAt"}&lang=${lang}`
  )

  return response.data.data
}

export async function getAllPostsCount({ query = "all" }: { query?: PostFindQuery | "user" | null }) {
  const response = await API.get(`/posts/count?query=${query ?? "all"}`)

  return response.data.data
}

export async function getPopularPosts(lang: LangType) {
  const response = await API.get(`/posts/popular?lang=${lang}`)

  return response.data.data
}

export async function getTemplatePosts(lang: LangType) {
  const response = await API.get(`/posts/template?lang=${lang}`)

  return response.data.data
}

export async function getUserPosts(cursor: string | null = "0") {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
  if (cookie) {
    const response = await API.get(`/posts/user?cursor=${cursor}`)

    return response.data.data
  }
}

export async function getAllUserSaveCount() {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
  if (cookie) {
    const response = await API.get(`/posts/user/count`)

    return response.data.data
  }
}

export async function getSearchPosts(searchQuery: string) {
  const response = await API.get(`/posts/search?searchQuery=${searchQuery}`)

  return response.data.data
}
