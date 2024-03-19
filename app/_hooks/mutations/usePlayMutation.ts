"use client"

import { queryKey } from "@/_data"
import { toastError } from "@/_data/toast"
import { finishPlay } from "@/_queries/post"
import { PostCardType } from "@/_types/post"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export const usePlayMutation = (postId: string) => {
  const { t } = useTranslation(["messages"])
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationKey: queryKey.play,
    mutationFn: (finishedPost: any) => finishPlay(postId, finishedPost),
    onMutate: async (finishedPost) => {
      const postKey = queryKey.post(postId)
      await queryClient.invalidateQueries({
        predicate: (target) => target.queryKey.includes("userPosts"),
      })

      await queryClient.cancelQueries({ queryKey: postKey })
      const previous = queryClient.getQueriesData({
        predicate: (target) =>
          target.queryKey.includes("allPosts") || target.queryKey.includes(`${finishedPost.type}Posts`),
      })
      const previous2 = queryClient.getQueryData(postKey)

      Promise.allSettled(
        previous.map(async (targetKey) => {
          await queryClient.setQueryData(targetKey[0], (old: PostCardType[]) => {
            if (!old) return
            const targetIndex = old.findIndex((v) => v.postId === postId)
            if (targetIndex >= 0) {
              old[targetIndex] = finishedPost
            }
            return old
          })
        })
      )
      queryClient.setQueryData(postKey, finishedPost)

      return { previous, previous2 }
    },
    onError: () => {
      toastError(t(`error.unknown`))
    },
  })

  return { mutate }
}
