import { PostCardType } from "@/_types/post"

export default function paginationOptimistic(old: any, targetPostId: string) {
  if (!old) return undefined
  const flat = [...old.pages.flat()].filter((v) => v.postId !== targetPostId)

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
}
