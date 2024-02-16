import { PostContentType, ThumbnailType } from "@/_store/newPost"
import { UserType } from "../user"
import { ContestCandidateType } from "./contest"
import { PollingCandidateType } from "./polling"

//todo: export type PostFindQuery = "all" | "popular" | "like" | "participate"
export type PostFormatType = "default" | "secret" | "preview"

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
  layout: "text" | "image" | "textImage"
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
  user: UserType
}

export interface NewPostType extends PostBaseType {
  type: PostContentType | null
  info: PostCardInfo
  content: any
}

export interface PostCardType extends PostBaseType {
  type: PostContentType
  info: PostCardInfo
  createdAt: Date
}

interface PostType extends PostBaseType {
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
