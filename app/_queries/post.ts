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

export async function uploadImage(file: FormData) {
  const response = await server.post(`/upload${process.env.NODE_ENV === "development" ? "/dev" : ""}`, file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export async function createNewPost(newPost: { [key: string]: any }) {
  try {
    const response = await server.post(`/post`, newPost)

    return { msg: "ok", data: response.data }
  } catch (error) {
    return error
  }
}
