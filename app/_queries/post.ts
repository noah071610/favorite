import { PostCardType, PostFindQuery, PostType } from "@/_types/post"
import { abstractPostContent, abstractPostsInfo } from "@/_utils/post"
import { server } from "./provider/reactQueryProvider"

export async function getPosts(query: PostFindQuery, page: number) {
  const response = await server.get(`/post/all?query=${query}&page=${page}`)

  const data: PostCardType[] = abstractPostsInfo(response.data)

  return data
}

export async function getPost(postId: string) {
  const response = await server.get(`/post?postId=${postId}`)

  const data: PostType = abstractPostContent(response.data)

  return data
}
