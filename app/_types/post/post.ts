import { UserType } from "../user"

//todo: export type PostFindQuery = "all" | "popular" | "like" | "participate"
export type PostFormatType = "default" | "secret" | "preview"
export type PostingStatus = "init" | "edit" | "rending"
export type PostContentType = "polling" | "contest" | "tournament"
export type ThumbnailType = "custom" | "layout" | "none"
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
