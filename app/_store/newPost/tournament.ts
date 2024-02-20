import { TournamentCandidateType } from "@/_types/post/tournament"
import { create } from "zustand"

interface States {
  tournamentCandidates: TournamentCandidateType[]
}

type Actions = {
  addCandidate: (candidate: TournamentCandidateType) => void
  deleteCandidate: (index: number) => void
  changeCandidate: (index: number, state: { title?: string; imageSrc?: string }) => void
  clearTournamentContent: () => void
}

export const useTournamentStore = create<States & Actions>((set) => ({
  tournamentCandidates: [],
  addCandidate: (state) =>
    set((origin) => {
      return { tournamentCandidates: [...origin.tournamentCandidates, state] }
    }),
  changeCandidate: (index, state) =>
    set((origin) => ({
      tournamentCandidates: origin.tournamentCandidates.map((v, i) => (i === index ? { ...v, ...state } : v)),
    })),
  deleteCandidate: (index) =>
    set((origin) => {
      // memo: 1. 삭제
      const tournamentCandidates = origin.tournamentCandidates
        .filter((_, i) => i !== index)
        .map((v, i) => ({ ...v, number: i + 1 }))

      return { tournamentCandidates }
    }),
  clearTournamentContent: () =>
    set(() => {
      return { tournamentCandidates: [] }
    }),
}))
