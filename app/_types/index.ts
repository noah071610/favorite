import { PostCardType } from "./post/post"

export type ModalStatus = "none" | "search" | "createCandidate"

export interface PostCardListType {
  pageParams: number[]
  pages: PostCardType[][]
}
