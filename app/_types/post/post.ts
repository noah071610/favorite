import { UserType } from "../user"

//todo: export type PostFindQuery = "all" | "popular" | "like" | "participate"
export type PostFormatType = "default" | "secret" | "preview"
export type PostingStatus = "init" | "edit" | "rending"
export type PostContentType = "polling" | "contest" | "tournament"
export type ThumbnailType = "custom" | "layout" | "none"
export type PostOptionType = "isSecret" | "isNoComments"

export type VoteIdType = {
  postId: string
  listId: string
}

export interface PostCardInfo {
  participateImages: string[]
  shareCount: number
  like: number
  participateCount: number
  thumbnailType: ThumbnailType
  isNoComments: number
}

interface PostBaseType {
  postId: string
  title: string
  format: PostFormatType
  description: string
  thumbnail: string
}

export interface NewPostType extends PostBaseType {
  type: PostContentType | null
  info: PostCardInfo
  userId: number
  content: any
}

export interface PostCardType extends PostBaseType {
  user: UserType
  type: PostContentType
  info: PostCardInfo
  createdAt: Date
}

export interface PostType extends PostBaseType {
  user: UserType
  type: PostContentType
  comments: CommentType[]
  createdAt: Date
}

export interface CommentType {
  commentId: number
  user: UserType
  text: string
  like: number
}
