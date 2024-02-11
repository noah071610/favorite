import { ModalStatus } from "@/_types"
import { create } from "zustand"

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
