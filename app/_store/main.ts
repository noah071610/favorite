import { ErrorTypes, ModalStatus } from "@/_types"
import { create } from "zustand"

interface States {
  modalStatus: ModalStatus
  error: {
    type: ErrorTypes | null
    text?: string
  }
}

type Actions = {
  setModal: (state: States["modalStatus"]) => void
  setError: ({ type, text }: { type: ErrorTypes; text?: string }) => void
}

export const useMainStore = create<States & Actions>()((set) => ({
  modalStatus: "none",
  error: {
    type: null,
    text: "",
  },
  setModal: (state) => set(() => ({ modalStatus: state })),
  setError: ({ type, text }) =>
    set(() => {
      if (type === "clear") {
        return { error: { type: null, text: "" } }
      } else {
        return { error: { type, text } }
      }
    }),
}))
