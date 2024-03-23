import SecretPostPage from "@/[lang]/post/[postId]/_components/secret"
import { _url } from "@/_data"
import { getPost } from "@/_queries/post"
import { PostType } from "@/_types/post"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import NotFound from "./error"
import Loading from "./loading"

const ContestPost = dynamic(() => import("./_components/Contest"), {
  ssr: true,
})
const PollingPost = dynamic(() => import("./_components/Polling"), {
  ssr: true,
})
const TournamentPost = dynamic(() => import("./_components/Tournament"), {
  ssr: true,
})

const getData = async (postId: string) => {
  const res = await getPost(postId)

  return res
}

export async function generateMetadata({ params }: { params: { postId: string } }): Promise<Metadata> {
  const data = await getData(params.postId)
  if (!data) return {}
  const { title, description: _description, thumbnail: _thumbnail } = data
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
      url: _url.client + `/post/${params.postId}`,
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

const PostPage = async ({ params: { postId } }: { params: { postId: string } }) => {
  const initialPost: PostType = await getData(postId)
  if (!initialPost) return <NotFound />
  const format = initialPost.format
  if (format === "preview" || format === "editing") return <SecretPostPage />

  return (
    <Suspense fallback={<Loading />}>
      {initialPost.type === "contest" && <ContestPost initialPost={initialPost} />}
      {initialPost.type === "polling" && <PollingPost initialPost={initialPost} />}
      {initialPost.type === "tournament" && <TournamentPost initialPost={initialPost} />}
    </Suspense>
  )
}

export default PostPage
