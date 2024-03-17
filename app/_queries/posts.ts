import { API } from "@/_data"
import { PostFindQuery } from "@/_types/post"
import { Cookies } from "react-cookie"

const cookies = new Cookies()

export async function getPosts({ pageParam = 0, query }: { pageParam?: number; query: PostFindQuery }) {
  const response = await API.get(`/posts?cursor=${pageParam}&query=${query}`)

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
