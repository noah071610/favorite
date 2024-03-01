import { PostType } from "./post"

export interface TournamentCandidateType {
  listId: string
  imageSrc: string
  title: string
  number: number
  win: number
  lose: number
  pick: number
}
export interface TournamentCandidateOnGameType extends TournamentCandidateType {
  out?: boolean
}
export type TournamentCandidateKeyType = keyof TournamentCandidateType
export const tournamentCandidateKeys: TournamentCandidateKeyType[] = [
  "listId",
  "imageSrc",
  "title",
  "pick",
  "win",
  "lose",
  "number",
]

export interface TournamentCandidateChartType extends TournamentCandidateType {
  rating: number
  winPercent: string
  pickPercent: string
  losePercent: string
}

export interface TournamentContentType {
  candidates: TournamentCandidateType[]
}

export interface TournamentPostType extends PostType {
  content: TournamentContentType
}
