// import { PostCardDataType, PostDataType } from "@/_types/post"

import { NewPostType } from "@/_types/post/post"

// export const abstractPostsInfo = (posts: PostCardDataType[]) => posts.map((v) => ({ ...v, info: JSON.parse(v.info) }))

// export const abstractPostContent = (post: PostDataType) => ({
//   ...post,
//   content: JSON.parse(post.content),
// })

export function checkNewPostType(localObj: any): boolean {
  const requiredKeys: (keyof NewPostType)[] = [
    "postId",
    "title",
    "format",
    "description",
    "thumbnail",
    "type",
    "info",
    "user",
    "content",
  ]

  // 객체 a가 null 또는 undefined인지 확인
  if (!localObj) {
    return false
  }

  // 객체 a의 속성 개수와 필요한 속성 개수가 일치하는지 확인
  if (Object.keys(localObj).length !== requiredKeys.length) {
    return false
  }

  // 객체 a의 각 속성이 Type 인터페이스에 정의된 속성과 일치하는지 확인
  for (const key of requiredKeys) {
    if (typeof localObj[key] === "undefined") {
      return false
    }
  }

  // 모든 속성이 일치하면 true 반환
  return true
}
