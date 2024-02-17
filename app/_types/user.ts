export interface UserType {
  userId: number
  userName: string
  userImage: string
}

export interface UserExpendType extends UserType {
  liked: string[]
}
