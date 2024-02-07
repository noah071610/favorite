export type PostFindQuery = "all" | "popular" | "like" | "participate"

export interface CandidateType {
  listId: string
  number: number
  imageSrc: string
  title: string
  description: string
  count: number
}

export interface UserType {
  userId: string
  userName: string
  userImage: string
}

export interface PostCardInfo {
  participateImages: string[]
  shareCount: number
  like: number
  participateCount: number
}

interface _PostCardType {
  postId: string
  type: string
  title: string
  description: string
  thumbnail: string
  user: UserType
  createdAt: string
  updatedAt: string
}
export interface PostCardType extends _PostCardType {
  info: PostCardInfo
}
export interface PostCardDataType extends _PostCardType {
  info: string
}
export interface PostType extends _PostCardType {
  content: CandidateType[]
  comments: CommentType[]
}
export interface PostDataType extends _PostCardType {
  content: string
  comments: CommentType[]
}

export interface CommentType {
  commentId: number
  user: UserType
  text: string
  like: number
}
