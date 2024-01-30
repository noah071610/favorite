export interface ContentCardType {
  title: string
  description: string
  images: string[]
  postId: string
  user: {
    userId: string
    userName: string
    userImage: string
  }
}
