import { UserType } from "../user"

export type ContentLayoutType = "text" | "image" | "textImage"
export type PostFormatType = "default" | "secret" | "preview" | "template"
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

export interface PostPaginationType {
  pageParams: number[]
  pages: PostCardType[][]
}

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
  createdAt: Date
  lastPlayedAt: Date
  popular: number
}

export interface TemplatePostCardType extends PostCardType {
  content: {
    candidates: { imageSrc: string; title: string; description: string; listId: string; pick: number }[] // memo: 대충 두개만 쓸거라.. 두개만 넣음 이러면 안됨 수정 예정
  }
}

export interface PostType extends PostBaseType {
  type: PostContentType
  user: UserType
  comments: CommentType[]
  createdAt: Date
  // memo: 세부적인 content 타입은 따로 Extend해서 작성해 두었다. 헷갈려...
}

export interface CommentType {
  commentId: number
  user?: UserType
  text: string
}
