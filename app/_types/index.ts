import { errorMessage } from "@/_data/message"
import { PostCardType } from "./post"

export type ModalStatus =
  | "none"
  | "search"
  | "createCandidate"
  | "newPostLoad"
  | "changePostType"
  | "roundSelect"
  | "login"
  | "loginNewPost"
  | "newPostLoginSuccess"
  | "aside"
  | "share"
  | "loadTemplate"
  | "mobileSelectCandidate"
  | "deletePost"
  | "createPost"

export interface PostCardListType {
  pageParams: number[]
  pages: PostCardType[][]
}

export type ErrorTypes = keyof typeof errorMessage
