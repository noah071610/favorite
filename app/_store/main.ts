import { create } from "zustand"

export type ModalStatus = "none" | "search"

interface States {
  modalStatus: ModalStatus
}

type Actions = {
  setModal: (state: States["modalStatus"]) => void
}

export const useMainStore = create<States & Actions>()((set) => ({
  modalStatus: "none",
  setModal: (state) => set(() => ({ modalStatus: state })),
}))
