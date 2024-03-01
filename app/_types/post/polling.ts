import { ContentLayoutType, PostType } from "./post"

export interface PollingCandidateType {
  listId: string
  imageSrc: string
  title: string
  description: string
  pick: number
  number: number
}
export type PollingCandidateKeyType = keyof PollingCandidateType
export const pollingCandidateKeys: PollingCandidateKeyType[] = [
  "listId",
  "imageSrc",
  "title",
  "description",
  "pick",
  "number",
]

export interface PollingContentType {
  chartDescription: string
  layout: ContentLayoutType
  candidates: PollingCandidateType[]
}

export interface PollingPostType extends PostType {
  content: PollingContentType
}
