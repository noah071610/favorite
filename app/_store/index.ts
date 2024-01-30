import { create } from "zustand"

export type modalStatus = "none" | "search"
interface States {
  modalStatus: modalStatus
}

type Actions = {
  setModal: (state: States["modalStatus"]) => void
}

export const useModalStore = create<States & Actions>()((set) => ({
  modalStatus: "none",
  setModal: (state) => set(() => ({ modalStatus: state })),
}))
