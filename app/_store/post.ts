import { PostType } from "@/_types/post"
import { create } from "zustand"

export type CandidateType = {
  listId: string
  imageSrc: string
  title: string
  description: string
  count: number
  number: number
}

interface States {
  selectedCandidate: CandidateType | null
  viewCandidate: CandidateType | null // todo: 꼭 전부?
  postLoaded: boolean
  post: PostType | null // todo: 이거 좀 별론데?
}

type Actions = {
  setSelectedCandidate: (state: States["selectedCandidate"]) => void
  setViewCandidate: (state: States["viewCandidate"]) => void
  setPostLoaded: (state: States["postLoaded"]) => void
  setPost: (state: States["post"]) => void
}

export const usePostStore = create<States & Actions>()((set) => ({
  postLoaded: false,
  selectedCandidate: null,
  viewCandidate: null,
  post: null,
  setSelectedCandidate: (state) => set(() => ({ selectedCandidate: state })),
  setViewCandidate: (state) => set(() => ({ viewCandidate: state })),
  setPostLoaded: (state) => set(() => ({ postLoaded: state })),
  setPost: (state) => set(() => ({ post: state })),
}))
