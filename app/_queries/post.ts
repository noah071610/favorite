import { server } from "@/_data"
import { useMutation, useQueryClient } from "@tanstack/react-query"

function sliceArray(array: any[]) {
  const result = []
  for (let i = 0; i < array.length; i += 12) {
    result.push(array.slice(i, i + 12))
  }
  return result
}

export async function getPosts({ pageParam = 0 }) {
  const response = await server.get(`/post/all?cursor=${pageParam}`)

  return response.data
}

export async function getPost(postId: string) {
  const response = await server.get(`/post?postId=${postId}`)

  return response.data
}

export async function likePost(userId: number, postId: string) {
  const response = await server.patch(`/post/like?postId=${postId}&userId=${userId}`)

  return response.data
}

export function likeMutate(userId: number, postId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["getPosts"],
    mutationFn: () => likePost(userId, postId),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["getPosts"] })

      await queryClient.setQueryData(["getPosts"], (oldData: any) => {
        const pages = [...oldData.pages.flat()]

        return {
          pageParams: oldData.pageParams,
          pages: sliceArray(
            pages.map((v) => (v.postId === postId ? { ...v, info: { ...v.info, like: v.info.like + 1 } } : v))
          ),
        }
      })
    },
  })
}
