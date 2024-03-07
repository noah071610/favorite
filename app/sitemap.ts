import { MetadataRoute } from "next"
import { getPopularPosts } from "./_queries/post"
import { PollingPostType } from "./_types/post/polling"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPopularPosts()
  return posts.map((post: PollingPostType) => {
    return {
      url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/post/polling/${post.postId}`,
      lastModified: post.createdAt,
      priority: 1,
    }
  })
}
