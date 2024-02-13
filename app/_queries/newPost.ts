import { server } from "@/_data"

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
