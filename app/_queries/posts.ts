import { API } from "@/_data"
import { ContentPageParams, PostFindQuery } from "@/_types/post"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function getPosts({ cursor = "0", query = "all", sort = "createdAt" }: ContentPageParams) {
  const response = await API.get(`/posts?cursor=${cursor ?? "0"}&query=${query ?? "all"}&sort=${sort ?? "createdAt"}`)

  return response.data
}

export async function getAllPostsCount({ query = "all" }: { query?: PostFindQuery | null }) {
  const response = await API.get(`/posts/count?query=${query ?? "all"}`)

  return response.data
}

export async function getPopularPosts() {
  const response = await API.get(`/posts/popular`)

  return response.data
}

export async function getUserPosts() {
  const cookie = cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? "")
  if (cookie) {
    const response = await API.get(`/posts/user`)

    return response.data
  }
}

export async function getTemplatePosts() {
  const response = await API.get(`/posts/template`)

  return response.data
}

export async function getSearchPosts(searchQuery: string) {
  const response = await API.get(`/posts/search?searchQuery=${searchQuery}`)

  return response.data
}
