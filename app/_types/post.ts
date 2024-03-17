import { UserType } from "./user"

export type ContentLayoutType = "text" | "image" | "textImage"
export type PostFormatType = "default" | "secret" | "preview" | "template" | "editing"
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

export interface PostCardType {
  postId: string
  type: PostContentType
  title: string
  description: string
  format: PostFormatType
  count: number
  thumbnail: string
  popular: number
  createdAt: Date
  lastPlayedAt: Date
}

export interface PostType extends PostCardType {
  content: ContentType
  comments: CommentType[]
  user: UserType
}

export interface ContentType {
  layout: ContentLayoutType
  resultDescription: string
  newPostStatus: PostingStatus
  candidates: CandidateType[] // 후보자 배열, 타입이 정확히 알려지지 않았으므로 any로 지정
  thumbnail: ThumbnailSettingType
  selectedCandidateIndex: number
  isEditOn: boolean
}

export interface CommentType {
  commentId: number
  user?: UserType
  text: string
}

export interface CandidateType {
  listId: string
  number: number
  title: string
  description: string
  imageSrc: string
  win: number
  lose: number
  pick: number
}

export type CandidateKeyType = keyof CandidateType
export const candidateKeys: CandidateKeyType[] = [
  "listId",
  "number",
  "title",
  "description",
  "imageSrc",
  "win",
  "lose",
  "pick",
]

export interface TournamentCandidateOnGameType extends CandidateType {
  out?: boolean
}
export interface TournamentCandidateChartType extends CandidateType {
  rating: number
  winPercent: string
  pickPercent: string
  losePercent: string
}
