// import { PostCardDataType, PostDataType } from "@/_types/post"

import { contestCandidateKeys } from "@/_types/post/contest"
import { pollingCandidateKeys } from "@/_types/post/polling"
import { PostContentType, ThumbnailSettingType } from "@/_types/post/post"
import { tournamentCandidateKeys } from "@/_types/post/tournament"
import { UserType } from "@/_types/user"
import { cloneDeep } from "lodash"
import { nanoid } from "nanoid"

// export const abstractPostsInfo = (posts: PostCardDataType[]) => posts.map((v) => ({ ...v, info: JSON.parse(v.info) }))

// export const abstractPostContent = (post: PostDataType) => ({
//   ...post,
//   content: JSON.parse(post.content),
// })

const keys = {
  polling: pollingCandidateKeys,
  contest: contestCandidateKeys,
  tournament: tournamentCandidateKeys,
}

export function checkNewPost(newPost: any, content: any, candidates: { [key: string]: any }[], thumbnail: any) {
  if (!newPost) return "unknown"
  if (!newPost.type) return "unknown"
  if (newPost.title.trim().length < 3) return "postTitle"

  if (newPost.type === "tournament") {
    if (candidates.length < 4) return "tournamentCandidateLength"
  }
  if (candidates.length < 2) return "candidateLength"
  if (!candidates.every(({ title }) => !!title.trim())) return "noCandidateTitle"

  if (candidates.length < 2) return "candidateLength"
  if (!candidates.every(({ title }) => !!title.trim())) return "noCandidateTitle"

  if (
    newPost.type === "contest" ||
    newPost.type === "tournament" ||
    (newPost.type === "polling" && (content.layout === "image" || content.layout === "textImage"))
  ) {
    if (!candidates.every(({ imageSrc }) => !!imageSrc.trim())) return "noCandidateImage"
  }

  const type = newPost.type as PostContentType
  for (let i = 0; i < candidates.length; i++) {
    const target = candidates[i]

    if (Object.keys(target).length !== keys[type].length) {
      return "candidateError"
    }
    for (const key of keys[type]) {
      if (typeof candidates[i][key] === "undefined") {
        return "candidateError"
      }
    }
  }

  if (thumbnail.type === "layout" && thumbnail.layout.length < 2) {
    return "unknown"
  }

  return null
}

export function generatePostData({
  newPost,
  content,
  candidates,
  thumbnail,
  user,
  isEditPost,
}: {
  newPost: any
  content: any
  candidates: { [key: string]: any }[]
  thumbnail: ThumbnailSettingType
  user: UserType
  isEditPost?: boolean
}) {
  const thumbnailCreate =
    thumbnail.type === "layout" ? thumbnail.layout.join("${}$") : thumbnail.type === "none" ? "" : thumbnail.imageSrc
  if (isEditPost) {
    return cloneDeep({
      ...newPost,
      thumbnail: thumbnailCreate,
      content: { ...content, candidates: candidates.map((v, i) => ({ ...v, number: i + 1 })) },
    })
  } else {
    return cloneDeep({
      ...newPost,
      thumbnail: thumbnailCreate,
      postId: nanoid(10),
      count: 0,
      userId: user.userId,
      content: { ...content, candidates: candidates.map((v, i) => ({ ...v, number: i + 1 })) },
    })
  }
}

export const handleBeforeUnload = (data: any, event?: any) => {
  localStorage.setItem("favorite_save_data", JSON.stringify(data))
  if (event) {
    event.returnValue = "Are you sure you want to leave?"
  }
}
