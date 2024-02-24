import { getPost } from "@/_queries/post"
import { Suspense } from "react"
import PollingPost from "./_components"
import PollingLoading from "./loading"

export const getData = async (postId: string) => {
  const res = await getPost(postId)
  return res
}

const PollingPostPage = async ({ params: { postId } }: { params: { postId: string } }) => {
  const post = await getData(postId)

  return (
    <Suspense fallback={<PollingLoading />}>
      <PollingPost post={post} />
    </Suspense>
  )
}

export default PollingPostPage
