export interface UserType {
  userId: string
  userName: string
  userImage: string
}

export interface ContentCardType {
  title: string
  description: string
  images: string[]
  postId: string
  user: UserType
}

export interface CommentType {
  user: UserType
  text: string
  like: number
  favorite: {
    id: string
    color: string
    number: number
  }
}

export type GaugeStyle = "happy" | "crying" | "enraged" | "flushed"
