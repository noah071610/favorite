"use client"
import { queryKey } from "@/_data"
import { toastError } from "@/_data/toast"
import { commenting } from "@/_queries/post"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export const useCommentMutation = (commented: () => void) => {
  const { t } = useTranslation(["messages"])
  const queryClient = useQueryClient()
  const { mutate, isSuccess } = useMutation({
    mutationKey: queryKey.comment,
    mutationFn: ({ userId, postId, text }: { userId: number; postId: string; text: string; userName: string }) =>
      commenting({ userId, postId, text }),
    onMutate: async (data) => {
      const key = queryKey.post(data.postId)
      await queryClient.cancelQueries({ queryKey: key })

      // Snapshot the previous value
      const previous = queryClient.getQueryData(key)

      // Optimistically update to the new value
      queryClient.setQueryData(key, (old: any) => {
        return {
          ...old,
          comments: [
            {
              createdAt: new Date(),
              text: data.text,
              user: {
                userName: data.userName,
                userId: data.userId,
              },
            },
            ...old.comments,
          ],
        }
      })

      return { previous }
    },
    onError: () => {
      toastError(t(`error.unknown`))
    },
    onSuccess: () => {
      commented()
    },
  })

  return { mutate, isSuccess }
}
