import { PostFindQuery } from "@/_types/post"
import { server } from "./provider/reactQueryProvider"

export async function getPosts(query: PostFindQuery, page: number) {
  const response = await server.get(`/post/all?query=${query}&page=${page}`)

  return response.data
}

export async function getPost(postId: string) {
  const response = await server.get(`/post?postId=${postId}`)

  return response.data
}
