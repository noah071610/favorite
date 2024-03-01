import { PostType } from "./post"

export interface ContestCandidateType {
  listId: "left" | "right"
  title: string
  imageSrc: string
  number: number
  pick: number
}
export type ContestCandidateKeyType = keyof ContestCandidateType
export const contestCandidateKeys: ContestCandidateKeyType[] = ["listId", "imageSrc", "title", "pick", "number"]

export interface ContestContentType {
  candidates: ContestCandidateType[]
}

export interface ContestPostType extends PostType {
  content: ContestContentType
}
