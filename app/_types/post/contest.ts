import { PostType } from "./post"

export interface ContestCandidateType {
  listId: "left" | "right"
  title: string
  imageSrc: string
  count: number
}

export interface ContestContentType {
  left: ContestCandidateType
  right: ContestCandidateType
}

export interface ContestPostType extends PostType {
  content: ContestContentType
}
