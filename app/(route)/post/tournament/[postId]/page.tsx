import { _url } from "@/_data"
import { getThumbnail } from "@/_data/post"
import { getPost } from "@/_queries/post"
import { TournamentPostType } from "@/_types/post/tournament"
import { Metadata } from "next"
import { Suspense } from "react"
import TournamentPost from "./_components"
import TournamentLoading from "./loading"

export const getData = async (postId: string) => {
  const res = await getPost(postId)
  return res
}

export async function generateMetadata({ params }: { params: { postId: string } }): Promise<Metadata> {
  const { title, description: _description, thumbnail: _thumbnail }: TournamentPostType = await getPost(params.postId)
  const description = _description.trim() ? _description.slice(0, 100) : undefined
  const thumbnail = getThumbnail(_thumbnail)
  return {
    title: title.length > 50 ? title.slice(0, 50) + "..." : title,
    description,
    openGraph: {
      title,
      description,
      images: thumbnail.length > 0 ? thumbnail : ["/images/post/todo:"],
      url: _url.client + `/post/tournament/${params.postId}`,
      type: "website",
      siteName: "favorite",
    },
  }
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
