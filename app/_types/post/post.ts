import { UserType } from "../user"

export type ContentLayoutType = "text" | "image" | "textImage"
export type PostFormatType = "default" | "secret" | "preview"
export type PostingStatus = "init" | "edit" | "rending"
export type PostContentType = "polling" | "contest" | "tournament"
export type ThumbnailType = "custom" | "layout" | "none"
export interface ThumbnailSettingType {
  imageSrc: string
  type: ThumbnailType
  layout: string[]
  slice: number
  isPossibleLayout: boolean
}
export type PostFindQuery = "all" | PostContentType

export type VoteIdType = {
  postId: string
  listId: string
}

interface PostBaseType {
  postId: string
  title: string
  format: PostFormatType
  description: string
  count: number
  thumbnail: string
}

export interface NewPostType extends PostBaseType {
  type: PostContentType | null
}

export interface PostCardType extends PostBaseType {
  type: PostContentType
  user: UserType
  createdAt: Date
}

export interface PostType extends PostBaseType {
  type: PostContentType
  user: UserType
  comments: CommentType[]
  createdAt: Date
}

export interface CommentType {
  commentId: number
  user?: UserType
  text: string
}
