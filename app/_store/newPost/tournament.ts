import { TournamentCandidateType, TournamentContentType } from "@/_types/post/tournament"
import { produce } from "immer"
import { create } from "zustand"

interface States {
  tournamentContent: TournamentContentType
}

type SetCandidateAction =
  | { index: number; type: "imageSrc"; payload: string }
  | { index: number; type: "title"; payload: string }
  | { index: number; type: "delete"; payload: string }

type Actions = {
  loadTournamentContent: (state: TournamentContentType) => void
  addCandidate: (payload: TournamentCandidateType) => void
  setTournamentCandidate: (action: SetCandidateAction) => void
  clearTournamentContent: () => void
}

export const useTournamentStore = create<States & Actions>((set) => ({
  tournamentContent: {
    candidates: [],
  },
  addCandidate: (payload) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.tournamentContent.candidates.push(payload)
      })
    ),
  setTournamentCandidate: ({ index, payload, type }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const target = draft.tournamentContent.candidates[index]
        const candidates = draft.tournamentContent.candidates
        const actionHandlers = {
          title: () => {
            target.title = payload as string
          },
          imageSrc: () => {
            target.imageSrc = payload as string
          },
          delete: () => {
            draft.tournamentContent.candidates = candidates.filter((_, i) => i !== index)
          },
        }
        const handler = actionHandlers[type]
        if (handler && target) {
          handler()
        }
      })
    ),
  clearTournamentContent: () =>
    set(() => ({
      tournamentContent: {
        candidates: [],
      },
    })),
  loadTournamentContent: (state) =>
    set(() => ({
      tournamentContent: state,
    })),
}))
