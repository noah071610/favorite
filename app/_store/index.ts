import { create } from "zustand"

export type ModalStatus = "none" | "search"
export type PostingStatus = "init" | "result" | "rending"
export type CandidateType = {
  listId: string
  imageSrc: string
  title: string
  description: string
  count: number
}

interface States {
  modalStatus: ModalStatus
  currentPostingPage: PostingStatus
  selectedCandidate: CandidateType | null
  viewCandidates: CandidateType[]
}

type Actions = {
  setModal: (state: States["modalStatus"]) => void
  setCurrentPostingPage: (state: States["currentPostingPage"]) => void
  setSelectedCandidate: (state: States["selectedCandidate"]) => void
  addViewCandidate: (state: CandidateType) => void
  removeViewCandidate: (listId: string) => void
  removeAllViewCandidate: () => void
}

export const useMainStore = create<States & Actions>()((set) => ({
  modalStatus: "none",
  currentPostingPage: "init",
  selectedCandidate: null,
  viewCandidates: [],
  setModal: (state) => set(() => ({ modalStatus: state })),
  setCurrentPostingPage: (state) => set(() => ({ currentPostingPage: state })),
  setSelectedCandidate: (state) => set(() => ({ selectedCandidate: state })),
  addViewCandidate: (state) => set((origin) => ({ viewCandidates: [...origin.viewCandidates, state] })),
  removeViewCandidate: (listId) =>
    set((origin) => ({
      viewCandidates: origin.viewCandidates.filter(({ listId: originListId }) => originListId !== listId),
    })),
  removeAllViewCandidate: () =>
    set(() => ({
      viewCandidates: [],
    })),
}))
