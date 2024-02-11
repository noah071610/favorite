import { create } from "zustand"

interface States {
  viewCandidateNum: number
  postLoaded: boolean
}

type Actions = {
  setViewCandidateNum: (state: number) => void
  setPostLoaded: (state: States["postLoaded"]) => void
}

export const usePostStore = create<States & Actions>()((set) => ({
  postLoaded: false,
  viewCandidateNum: 0,
  setViewCandidateNum: (state) => set(() => ({ viewCandidateNum: state })),
  setPostLoaded: (state) => set(() => ({ postLoaded: state })),
}))
