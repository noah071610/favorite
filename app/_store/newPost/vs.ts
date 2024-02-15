import { create } from "zustand"

export interface VsCandidateType {
  title: string
  imageSrc: string
  count: number
}
interface States {
  leftCandidate: VsCandidateType
  rightCandidate: VsCandidateType
}

type Actions = {
  setCandidate: (
    target: "left" | "right",
    state: {
      title?: string
      imageSrc?: string
      count?: number
    }
  ) => void
}

export const useVsTypeStore = create<States & Actions>((set) => ({
  leftCandidate: {
    title: "",
    imageSrc: "",
    count: 0,
  },
  rightCandidate: {
    title: "",
    imageSrc: "",
    count: 0,
  },
  setCandidate: (target, state) =>
    set((origin) => {
      if (target === "left") {
        return { leftCandidate: { ...origin.leftCandidate, ...state } }
      } else {
        return { rightCandidate: { ...origin.rightCandidate, ...state } }
      }
    }),
}))
