"use client"

import { queryKey } from "@/_data"
import { toastError } from "@/_data/toast"
import { finishPlay } from "@/_queries/post"
import { PostCardType, PostPaginationType } from "@/_types/post/post"
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
      await queryClient.cancelQueries({ queryKey: queryKey.home.all })
      await queryClient.cancelQueries({ queryKey: postKey })

      // Snapshot the previous value
      const previous = queryClient.getQueryData(queryKey.home.all)
      const previous2 = queryClient.getQueryData(postKey)

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey.home.all, (old: PostPaginationType) => {
        if (!old) return
        const flat = [...old.pages.flat()]
        const targetIndex = flat.findIndex((v) => v.postId === postId)
        if (targetIndex >= 0) {
          flat[targetIndex] = finishedPost
        }
        return {
          ...old,
          pages: flat.reduce((acc: PostCardType[][], curr: PostCardType, index: number) => {
            if (index % 12 === 0) {
              acc.push([curr])
            } else {
              acc[acc.length - 1].push(curr)
            }
            return acc
          }, []),
        }
      })

      queryClient.setQueryData(postKey, finishedPost)

      return { previous, previous2 }
    },
    onError: () => {
      toastError(t(`error.unknown`))
    },
  })

  return { mutate }
}
