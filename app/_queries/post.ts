import { server } from "./provider/reactQueryProvider"

export async function getPosts({ pageParam = 0 }) {
  const response = await server.get(`/post/all?cursor=${pageParam}`)

  return response.data
}

export async function getPost(postId: string) {
  const response = await server.get(`/post?postId=${postId}`)

  return response.data
}

export async function uploadImage(file: FormData) {
  const response = await server.post(`/upload`, file, {
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
