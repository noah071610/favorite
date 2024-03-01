import { API } from "@/_data"
import { PostCardType } from "@/_types/post/post"
import { randomNum } from "@/_utils/math"
import { produce } from "immer"

export async function uploadImage(file: FormData, dev?: number) {
  if (process.env.NODE_ENV !== "production") {
    dev = dev ?? 0
    return {
      msg: "ok",
      imageSrc: `https://picsum.photos/id/${randomNum(100, 500)}/500/300`,
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
