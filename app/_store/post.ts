import { create } from "zustand"

export type CandidateType = {
  listId: string
  imageSrc: string
  title: string
  description: string
  count: number
}

interface States {
  selectedCandidate: CandidateType | null
  viewCandidates: CandidateType[]
  postLoaded: boolean
}

type Actions = {
  setSelectedCandidate: (state: States["selectedCandidate"]) => void
  setPostLoaded: (state: States["postLoaded"]) => void
  addViewCandidate: (state: CandidateType) => void
  removeViewCandidate: (listId: string) => void
  removeAllViewCandidate: () => void
}

export const usePostStore = create<States & Actions>()((set) => ({
  postLoaded: false,
  selectedCandidate: null,
  viewCandidates: [],
  setSelectedCandidate: (state) => set(() => ({ selectedCandidate: state })),
  setPostLoaded: (state) => set(() => ({ postLoaded: state })),
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
