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
  | "loginInContent"
  | "aside"
  | "share"
  | "loadTemplate"
  | "mobileSelectCandidate"
  | "deletePost"
  | "createPost"
  | "loginInContent"
  | "loginInContentSuccess"

export interface PostCardListType {
  pageParams: number[]
  pages: PostCardType[][]
}

export type ErrorTypes = keyof typeof errorMessage
