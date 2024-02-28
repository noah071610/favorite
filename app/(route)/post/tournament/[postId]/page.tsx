import { getPost } from "@/_queries/post"
import { Suspense } from "react"
import TournamentPost from "./_components"
import TournamentLoading from "./loading"

export const getData = async (postId: string) => {
  const res = await getPost(postId)
  return res
}

const TournamentPostPage = async ({ params: { postId } }: { params: { postId: string } }) => {
  const initialPost = await getData(postId)

  return (
    <Suspense fallback={<TournamentLoading />}>
      <TournamentPost initialPost={initialPost} />
    </Suspense>
  )
}

export default TournamentPostPage
