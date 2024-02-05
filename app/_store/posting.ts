import { create } from "zustand"

export type PostingStatus = "init" | "result" | "rending"

interface States {
  currentPostingPage: PostingStatus
}

type Actions = {
  setCurrentPostingPage: (state: States["currentPostingPage"]) => void
}

export const usePostingStore = create<States & Actions>()((set) => ({
  currentPostingPage: "init",
  setCurrentPostingPage: (state) => set(() => ({ currentPostingPage: state })),
}))
