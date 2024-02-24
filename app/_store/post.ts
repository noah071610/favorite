import { PollingCandidateType, PollingLayoutType } from "@/_types/post/polling"
import { VoteIdType } from "@/_types/post/post"
import { create } from "zustand"

interface States {
  isPreview: boolean
  isResultPage: boolean
  layoutType: PollingLayoutType | null
  selectedCandidate: PollingCandidateType | null
  votedId: VoteIdType | null
  postLoaded: boolean
}

type Actions = {
  setIsPreview: (state: States["isPreview"]) => void
  setIsResultPage: (state: States["isResultPage"]) => void
  setLayoutType: (state: States["layoutType"]) => void
  setSelectedCandidate: (state: States["selectedCandidate"]) => void
  setVotedId: (state: States["votedId"]) => void
  setPostLoaded: (state: States["postLoaded"]) => void
  resetStates: (state: { isPreview: boolean; layoutType: PollingLayoutType | null }) => void
}

export const usePostStore = create<States & Actions>((set) => ({
  isPreview: false,
  isResultPage: false,
  layoutType: null,
  postLoaded: false,
  votedId: null,
  selectedCandidate: null,
  setIsPreview: (state) => set(() => ({ isPreview: state })),
  setIsResultPage: (state) => set(() => ({ isResultPage: state })),
  setLayoutType: (state) => set(() => ({ layoutType: state })),
  setSelectedCandidate: (state) => set(() => ({ selectedCandidate: state })),
  setVotedId: (state) => set(() => ({ votedId: state })),
  setPostLoaded: (state) => set(() => ({ postLoaded: state })),
  resetStates: ({ isPreview, layoutType }) =>
    set(() => ({
      isPreview,
      isResultPage: false,
      layoutType,
      votedId: null,
      selectedCandidate: null,
    })),
}))
