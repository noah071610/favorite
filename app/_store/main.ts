import { ErrorTypes, ModalStatus } from "@/_types"
import { create } from "zustand"

interface States {
  modalStatus: ModalStatus
  windowSize: "mobile" | "medium" | "large" | "full" | null
  error: {
    type: ErrorTypes | null
    text?: string
  }
}

type Actions = {
  setModal: (state: States["modalStatus"]) => void
  setWindowSize: (state: States["windowSize"]) => void
  setError: ({ type, text }: { type: ErrorTypes; text?: string }) => void
}

export const useMainStore = create<States & Actions>()((set) => ({
  modalStatus: "none",
  error: {
    type: null,
    text: "",
  },
  windowSize: null,
  setModal: (state) => set(() => ({ modalStatus: state })),
  setWindowSize: (state) => set(() => ({ windowSize: state })),
  setError: ({ type, text }) =>
    set(() => {
      if (type === "clear") {
        return { error: { type: null, text: "" } }
      } else {
        return { error: { type, text } }
      }
    }),
}))
