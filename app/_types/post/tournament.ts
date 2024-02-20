import { PostType } from "./post"

export interface TournamentCandidateType {
  listId: string
  imageSrc: string
  title: string
  win: number
  lose: number
  pick: number
}

export interface TournamentContentType {
  candidates: TournamentCandidateType[]
}

export interface TournamentPostType extends PostType {
  content: TournamentContentType
}
