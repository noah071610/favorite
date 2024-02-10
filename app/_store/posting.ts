import { CandidateType, PostType } from "@/_types/post"
import { create } from "zustand"

export type PostingStatus = "init" | "result" | "rending"

interface States {
  newPost: PostType | null
  newCandidates: CandidateType[]
  selectedCandidate: CandidateType | null
  currentPostingPage: PostingStatus
}

type Actions = {
  setNewPost: (state: { [key: string]: any } | null) => void
  setSelectedCandidate: (state: States["selectedCandidate"]) => void
  setCurrentPostingPage: (state: States["currentPostingPage"]) => void
  addCandidate: (candidate: CandidateType) => void
  setNewCandidates: (targetListId: string, from: number, to: number) => void
  deleteCandidate: (listId: string) => void
  changeCandidate: (listId: string, state: { title?: string; description?: string; imageSrc?: string }) => void
  clearCandidate: () => void
}

export const usePostingStore = create<States & Actions>()((set) => ({
  newPost: null,
  newCandidates: [],
  selectedCandidate: null,
  currentPostingPage: "init",
  setNewPost: (state) =>
    set((origin) => ({ newPost: origin.newPost ? { ...origin.newPost, ...state } : (state as PostType) })),
  setSelectedCandidate: (state) => set(() => ({ selectedCandidate: state })),
  setCurrentPostingPage: (state) => set(() => ({ currentPostingPage: state })),
  addCandidate: (state) =>
    set((origin) => {
      return { newCandidates: [...origin.newCandidates, state] }
    }),
  setNewCandidates: (targetListId, from, to) =>
    set((origin) => {
      const _newCandidates = [...origin.newCandidates]
      const targetCandidate: CandidateType = origin.newCandidates.find(({ listId }) => listId === targetListId)!
      _newCandidates.splice(from, 1)
      _newCandidates.splice(to, 0, targetCandidate)

      return { newCandidates: _newCandidates.map((v, i) => ({ ...v, animation: "none", number: i + 1 })) }
    }),
  changeCandidate: (targetListId, state) =>
    set((origin) => ({
      selectedCandidate: !origin.selectedCandidate ? null : { ...origin.selectedCandidate, ...state },
      newCandidates: origin.newCandidates.map((v) => (v.listId === targetListId ? { ...v, ...state } : v)),
    })),
  deleteCandidate: (targetListId) =>
    set((origin) => {
      const newCandidates = origin.newCandidates.filter((v, index) => {
        if (v.listId !== targetListId) {
          return true
        }
        return false
      })
      return { newCandidates }
    }),
  clearCandidate: () =>
    set(() => {
      return { newCandidates: [] }
    }),
}))
