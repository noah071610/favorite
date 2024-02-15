import { ListType } from "@/_types/post"
import { create } from "zustand"

export type CandidateDisplayType = "text" | "image" | "textImage"

interface States {
  candidateDisplayType: CandidateDisplayType
  newCandidates: ListType[]
  selectedCandidate: ListType | null
}

type Actions = {
  setCandidate: (action: "add" | "move" | "delete" | "change" | "clear", state?: any) => void
  setSelectedCandidate: (state: States["selectedCandidate"]) => void
}

export const useVoteTypeStore = create<States & Actions>((set) => ({
  candidateDisplayType: "textImage",
  newCandidates: [],
  selectedCandidate: null,
  section: "init",
  setCandidate: (action, state) => {
    set((origin) => {
      switch (action) {
        case "add":
          return { newCandidates: [...origin.newCandidates, state] }
        case "move":
          let _newCandidates = [...origin.newCandidates]
          const targetCandidate: ListType = origin.newCandidates.find(({ listId }) => listId === state.targetListId)!

          _newCandidates.splice(state.from, 1)
          _newCandidates.splice(state.to, 0, targetCandidate)
          _newCandidates = _newCandidates.map((v, i) => ({ ...v, number: i + 1 }))

          const _selectedCandidate: ListType | null = origin.selectedCandidate
          if (_selectedCandidate) {
            _selectedCandidate.number = _newCandidates.find(
              ({ listId }) => listId === _selectedCandidate.listId
            )!.number
          }
          return { newCandidates: _newCandidates, selectedCandidate: _selectedCandidate }
        case "change":
          return {
            selectedCandidate: !origin.selectedCandidate ? null : { ...origin.selectedCandidate, ...state.state },
            newCandidates: origin.newCandidates.map((v) =>
              v.listId === state.targetListId ? { ...v, ...state.state } : v
            ),
          }
        case "delete":
          const newCandidates = origin.newCandidates
            .filter((v) => v.listId !== state.targetListId)
            .map((v, i) => ({ ...v, number: i + 1 }))
          let selectedCandidate: ListType | null = origin.selectedCandidate
          if (selectedCandidate) {
            if (state.targetListId === origin.selectedCandidate?.listId) {
              selectedCandidate = null
            } else {
              selectedCandidate.number = newCandidates.find(
                ({ listId }) => listId === selectedCandidate?.listId
              )!.number
            }
          }
          return { newCandidates, selectedCandidate }
        case "clear":
          return { newCandidates: [] }
        default:
          return origin
      }
    })
  },
  setSelectedCandidate: (state) => set(() => ({ selectedCandidate: state })),
}))
