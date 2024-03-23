import { getSitemapPosts } from "@/_queries/posts"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getSitemapPosts()
  let priority = 1
  return (posts ?? []).map((post: any, i: number) => {
    return {
      url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/post/${post.postId}`,
      lastModified: post.createdAt,
      priority: priority - i * 0.0001,
    }
  })
}
