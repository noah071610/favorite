import { CandidateType } from "@/_types/post"
import { create } from "zustand"

interface States {
  viewCandidate: CandidateType | null // todo: 꼭 전부?
  postLoaded: boolean
}

type Actions = {
  setViewCandidate: (state: States["viewCandidate"]) => void
  setPostLoaded: (state: States["postLoaded"]) => void
}

export const usePostStore = create<States & Actions>()((set) => ({
  postLoaded: false,
  viewCandidate: null,
  setViewCandidate: (state) => set(() => ({ viewCandidate: state })),
  setPostLoaded: (state) => set(() => ({ postLoaded: state })),
}))
