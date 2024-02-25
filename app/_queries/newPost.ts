import { API } from "@/_data"

export async function uploadImage(file: FormData, dev?: number) {
  if (process.env.NODE_ENV !== "production") {
    dev = dev ?? 0
    return {
      msg: "ok",
      imageSrc: "https://upload.wikimedia.org/wikipedia/ko/b/b8/1917%EC%98%81%ED%99%94_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg",
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

export async function createNewPost(newPost: { [key: string]: any }) {
  const { user, ...rest } = newPost
  try {
    const response = await API.post(`/post`, { ...rest, userId: user.userId })
    return { msg: "ok", data: response.data }
  } catch (error) {
    return error
  }
}
