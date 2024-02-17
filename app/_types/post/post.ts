import { UserType } from "../user"
import { ContestCandidateType } from "./contest"
import { PollingCandidateType } from "./polling"

//todo: export type PostFindQuery = "all" | "popular" | "like" | "participate"
export type PostFormatType = "default" | "secret" | "preview"
export type PostingStatus = "init" | "edit" | "result" | "rending"
export type PostContentType = "polling" | "contest" | "tournament"
export type PollingLayoutType = "text" | "image" | "textImage"
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

interface PollingContentType {
  chartDescription: string
  layout: PollingLayoutType
  candidates: PollingCandidateType[]
}
export interface ContestContentType {
  left: ContestCandidateType
  right: ContestCandidateType
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

interface PostType extends PostBaseType {
  user: UserType
  type: PostContentType

  comments: CommentType[]

  createdAt: Date
}
export interface PollingPostType extends PostType {
  content: PollingContentType
}
export interface ContestPostType extends PostType {
  content: ContestContentType
}

export interface CommentType {
  commentId: number
  user: UserType
  text: string
  like: number
}
