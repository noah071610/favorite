import { MetadataRoute } from "next"
import { getPosts } from "./_queries/posts"
import { PostType } from "./_types/post"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  //todo : 모든 콘텐츠 다 가져와 버리기
  const posts_ko = await getPosts({ cursor: "0", query: "all", sort: "popular", lang: "ko" })
  return posts_ko.map((post: PostType) => {
    return {
      url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/post/${post.postId}`,
      lastModified: post.createdAt,
      priority: 1,
    }
  })
}
