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
      await queryClient.invalidateQueries({
        predicate: (target) => target.queryKey.includes("userPosts"),
      })

      await queryClient.cancelQueries({ queryKey: queryKey.post(postId) })
      await queryClient.cancelQueries({
        predicate: (target) =>
          target.queryKey.includes("allPosts") || target.queryKey.includes(`${finishedPost.type}Posts`),
      })

      const targetPosts = queryClient.getQueriesData({
        predicate: (target) =>
          target.queryKey.includes("allPosts") || target.queryKey.includes(`${finishedPost.type}Posts`),
      })
      Promise.allSettled(
        targetPosts.map(async (targetKey) => {
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
      await queryClient.setQueryData(queryKey.post(postId), finishedPost)

      return
    },
    onError: () => {
      toastError(t(`error.unknown`))
    },
  })

  return { mutate }
}
