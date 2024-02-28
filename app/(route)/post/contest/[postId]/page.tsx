import { getPost } from "@/_queries/post"
import { Suspense } from "react"
import ContestPost from "./_components"
import ContestLoading from "./loading"

export const getData = async (postId: string) => {
  const res = await getPost(postId)
  return res
}

const ContestPostPage = async ({ params: { postId } }: { params: { postId: string } }) => {
  const initialPost = await getData(postId)

  return (
    <Suspense fallback={<ContestLoading />}>
      <ContestPost initialPost={initialPost} />
    </Suspense>
  )
}

export default ContestPostPage
