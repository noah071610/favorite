import { VoteIdType } from "@/_types/post/post"
import { useEffect, useState } from "react"

export const checkVoted = ({
  candidates,
  postId,
  resolve,
}: {
  postId: string
  candidates: { [key: string]: any; listId: string }[]
  resolve?: (target?: any) => void
}) => {
  const [isVoted, setIsVoted] = useState(false)
  useEffect(() => {
    const participated: VoteIdType[] = JSON.parse(localStorage.getItem("participated") ?? "[]")
    const localVotedId = participated.find((v) => v.postId === postId)
    if (localVotedId) {
      const target = candidates.find(({ listId }) => listId === localVotedId.listId)
      if (target) {
        resolve && resolve(target)
        setIsVoted(true)
      } else {
        // memo: 에러이니까 리셋해버림
        localStorage.setItem(
          "participated",
          JSON.stringify(participated.filter(({ postId }) => postId !== localVotedId.postId))
        )
      }
    }
  }, [])

  return isVoted
}
