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

export type GaugeStyle = "happy" | "crying" | "enraged" | "flushed"
