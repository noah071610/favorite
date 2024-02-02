import { create } from "zustand"

export type ModalStatus = "none" | "search"
export type PostingStatus = "init" | "result" | "rending"

interface States {
  modalStatus: ModalStatus
  currentPostingPage: PostingStatus
}

type Actions = {
  setModal: (state: States["modalStatus"]) => void
  setCurrentPostingPage: (state: States["currentPostingPage"]) => void
}

export const useMainStore = create<States & Actions>()((set) => ({
  modalStatus: "none",
  currentPostingPage: "init",
  setModal: (state) => set(() => ({ modalStatus: state })),
  setCurrentPostingPage: (state) => set(() => ({ currentPostingPage: state })),
}))
