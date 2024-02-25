import { PostType } from "./post"

interface _TournamentCandidateType {
  listId: string
  imageSrc: string
  title: string
  number: number
}

export interface TournamentCandidateType extends _TournamentCandidateType {
  win: number
  lose: number
  pick: number
}
export interface TournamentCandidateChartType extends _TournamentCandidateType {
  win: string
  lose: string
  pick: string
  rating: number
}

export interface TournamentContentType {
  candidates: TournamentCandidateType[]
}

export interface TournamentPostType extends PostType {
  content: TournamentContentType
}
