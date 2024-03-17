// import { PostCardDataType, PostDataType } from "@/_types/post"

import { savePost } from "@/_queries/newPost"
import { NewPostStates } from "@/_store/newPost"
import { candidateKeys } from "@/_types/post"
import { cloneDeep } from "lodash"

// export const abstractPostsInfo = (posts: PostCardDataType[]) => posts.map((v) => ({ ...v, info: JSON.parse(v.info) }))

// export const abstractPostContent = (post: PostDataType) => ({
//   ...post,
//   content: JSON.parse(post.content),
// })

export function checkNewPost(newPost: NewPostStates) {
  const candidates = newPost.content.candidates
  if (!newPost) return "unknown"
  if (!newPost.type) return "unknown"
  if (newPost.title.trim().length < 3) return "postTitle"

  if (newPost.type === "tournament") {
    if (candidates.length < 4) return "tournamentCandidateLength"
  }
  if (candidates.length < 2) return "candidateLength"
  if (!candidates.every(({ title }) => !!title.trim())) return "noCandidateTitle"

  const content = newPost.content
  if (
    newPost.type === "contest" ||
    newPost.type === "tournament" ||
    (newPost.type === "polling" && (content.layout === "image" || content.layout === "textImage"))
  ) {
    if (!candidates.every(({ imageSrc }) => !!imageSrc.trim())) return "noCandidateImage"
  }

  const type = newPost.type
  for (let i = 0; i < candidates.length; i++) {
    const target = candidates[i]

    if (Object.keys(target).length !== candidateKeys.length) {
      return "candidateError"
    }
    for (const key of candidateKeys) {
      if (typeof candidates[i][key] === "undefined") {
        return "candidateError"
      }
    }
  }

  const thumbnail = newPost.content.thumbnail
  if (thumbnail.type === "layout" && thumbnail.layout.length < 2) {
    return "unknown"
  }

  return null
}

export function generatePostData({ newPost }: { newPost: NewPostStates }): NewPostStates {
  return cloneDeep({
    ...newPost,
    content: { ...newPost.content, candidates: newPost.content.candidates.map((v, i) => ({ ...v, number: i + 1 })) },
  })
}

export const handleBeforeUnload = async (data: any, event?: any) => {
  await savePost(data)
  if (event) {
    event.returnValue = "Are you sure you want to leave?"
  }
}
