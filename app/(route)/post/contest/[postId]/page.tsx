import { _url } from "@/_data"
import { getPost } from "@/_queries/post"
import { PostType } from "@/_types/post"
import { Metadata } from "next"
import { Suspense } from "react"
import ContestPost from "./_components"
import ContestLoading from "./loading"

export const getData = async (postId: string) => {
  const res = await getPost(postId)
  return res
}

export async function generateMetadata({ params }: { params: { postId: string } }): Promise<Metadata> {
  const { title, description: _description }: PostType = await getPost(params.postId)
  const description = _description.trim() ? _description.slice(0, 100) : undefined

  const ogUrl = new URL(`${_url.client}/api/og/${params.postId}`)

  return {
    title: title.length > 50 ? title.slice(0, 50) + "..." : title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      url: _url.client + `/post/contest/${params.postId}`,
      type: "website",
      siteName: "favorite",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()],
    },
  }
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
