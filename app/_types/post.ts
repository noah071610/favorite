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

export interface PostCardType {
  postId: string
  thumbnail: string
  title: string
  description: string
  user: UserType
  like: number
  shareCount: number
  participate: string[]
}

export interface CommentType {
  user: UserType
  text: string
  like: number
  favorite: {
    id: string
    color: string
    number: number
  } // todo: 꼭 필요할까?
}

export type GaugeStyle = "happy" | "crying" | "enraged" | "flushed"
