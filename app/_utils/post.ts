import { PostCardDataType, PostDataType } from "@/_types/post"

export const abstractPostsInfo = (posts: PostCardDataType[]) => posts.map((v) => ({ ...v, info: JSON.parse(v.info) }))

export const abstractPostContent = (post: PostDataType) => ({
  ...post,
  content: JSON.parse(post.content),
})
