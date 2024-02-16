import { ThumbnailType } from "@/_store/newPost"

export type PostFindQuery = "all" | "popular" | "like" | "participate"
export type PostFormatType = "default" | "secret" | "preview"

export type VoteIdType = {
  postId: string
  listId: string
}

export interface CandidateType {
  listId: string
  imageSrc: string
  title: string
  description?: string
  count: number
  number: number
}

export interface UserType {
  userId: number
  userName: string
  userImage: string
  liked: string[]
}

export interface PostCardInfo {
  participateImages: string[]
  shareCount: number
  like: number
  participateCount: number
  thumbnailType: ThumbnailType
  isNoComments: number
}

//todo : chartDescription

interface ContentType {
  chartDescription?: string
  layout: "text" | "image" | "textImage"
  candidates: CandidateType[]
}

interface _PostType {
  postId: string
  type: string
  title: string
  description: string
  thumbnail: string
  user: UserType
  createdAt: string
}

export interface NewPostType {
  postId: string
  type: string | null
  title: string
  format: PostFormatType
  description: string
  thumbnail: string
  user: UserType
  info: PostCardInfo
  content: ContentType
}

export interface PostCardType extends _PostType {
  info: PostCardInfo
}
export interface PostType extends _PostType {
  content: ContentType
  comments: CommentType[]
}

export interface CommentType {
  commentId: number
  user: UserType
  text: string
  like: number
}

export interface PostCardListType {
  pageParams: number[]
  pages: PostCardType[][]
}
