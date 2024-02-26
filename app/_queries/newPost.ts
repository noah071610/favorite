import { API } from "@/_data"
import { PostCardType } from "@/_types/post/post"
import { produce } from "immer"

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

export async function posting(newPost: { [key: string]: any }) {
  const response = await API.post(`/post`, newPost)
  return { msg: "ok", data: response.data }
}

export const onMutatePosting = async (queryClient: any, post: PostCardType) => {
  await queryClient.cancelQueries({ queryKey: ["homePosts"] })

  await queryClient.setQueryData(["homePosts"], (oldData: any) =>
    produce(oldData, (draft: any) => {
      draft.pages[0].push(post)
      return {
        pageParams: oldData.pageParams,
        pages: draft.pages,
      }
    })
  )
}
