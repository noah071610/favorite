import { getPost } from "@/_queries/post"
import { Suspense } from "react"
import TournamentPost from "./_components"
import TournamentLoading from "./loading"

export const getData = async (postId: string) => {
  const res = await getPost(postId)
  return res
}

const TournamentPostPage = async ({ params: { postId } }: { params: { postId: string } }) => {
  const post = await getData(postId)

  return (
    <Suspense fallback={<TournamentLoading />}>
      <TournamentPost post={post} />
    </Suspense>
  )
}

export default TournamentPostPage
