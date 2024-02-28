"use client"

import { VoteIdType } from "@/_types/post/post"
import { useEffect, useState } from "react"

export const useCheckVoted = ({
  disable,
  candidates,
  postId,
  resolve,
}: {
  disable: boolean
  postId: string
  candidates: { [key: string]: any; listId: string }[]
  resolve?: (target?: any) => void
}) => {
  const [isVoted, setIsVoted] = useState<boolean | null>(null) // 사용주의!
  useEffect(() => {
    const participated: VoteIdType[] = JSON.parse(localStorage.getItem("participated") ?? "[]")
    const localVotedId = participated.find((v) => v.postId === postId)

    if (localVotedId) {
      const target = candidates.find(({ listId }) => listId === localVotedId.listId)
      if (target) {
        resolve && resolve(target)
        setIsVoted(true)
      } else {
        setIsVoted(false)
        // memo: 에러이니까 리셋해버림
        localStorage.setItem(
          "participated",
          JSON.stringify(participated.filter(({ postId }) => postId !== localVotedId.postId))
        )
      }
    } else {
      setIsVoted(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return disable ? null : isVoted
}
