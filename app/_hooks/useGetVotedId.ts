import { usePostStore } from "@/_store/post"
import { VoteIdType } from "@/_types/post/post"
import { useEffect } from "react"

export const useGetVotedId = (postId: string) => {
  const { isPreview, setIsResultPage, setVotedId } = usePostStore()

  useEffect(() => {
    if (!isPreview && postId) {
      const participated: VoteIdType[] = JSON.parse(localStorage.getItem("participated") ?? "[]")
      const localVotedId = participated.find((v) => v.postId === postId)
      if (localVotedId) {
        setIsResultPage(true)
        setVotedId(localVotedId)
      }
    }
  }, [postId])
}
