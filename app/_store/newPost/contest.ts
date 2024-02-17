import { ContestCandidateType } from "@/_types/post/contest"
import { create } from "zustand"

interface States {
  leftCandidate: ContestCandidateType
  rightCandidate: ContestCandidateType
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
  clearContestContent: () => void
}

export const useContestTypeStore = create<States & Actions>((set) => ({
  leftCandidate: {
    listId: "left",
    title: "",
    imageSrc: "",
    count: 0,
  },
  rightCandidate: {
    listId: "right",
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
  clearContestContent: () =>
    set(() => ({
      leftCandidate: {
        listId: "left",
        title: "",
        imageSrc: "",
        count: 0,
      },
      rightCandidate: {
        listId: "right",
        title: "",
        imageSrc: "",
        count: 0,
      },
    })),
}))
