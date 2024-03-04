export interface UserType {
  userId: number
  userName: string
  userImage: string
}

export interface UserExpendType extends UserType {
  liked: string[]
}

export interface UserQueryType {
  msg: "ok" | "no"
  user: UserType | null
}

export type Providers = "google" | "facebook" | "instagram" | "twitter" | "local"
