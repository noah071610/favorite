import { ContestContentType } from "@/_types/post/contest"
import { produce } from "immer"
import { create } from "zustand"

interface States {
  contestContent: ContestContentType
}

type SetCandidateAction =
  | { direction: "left" | "right"; type: "imageSrc"; payload: string }
  | { direction: "left" | "right"; type: "title"; payload: string }

type Actions = {
  loadContestContent: (state: ContestContentType) => void
  setContestCandidate: (action: SetCandidateAction) => void
  clearContestContent: () => void
}

export const useContestStore = create<States & Actions>((set) => ({
  contestContent: {
    left: {
      listId: "left",
      title: "",
      imageSrc: "",
      count: 0,
    },
    right: {
      listId: "right",
      title: "",
      imageSrc: "",
      count: 0,
    },
  },
  setContestCandidate: ({ direction, payload, type }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const target = draft.contestContent[direction]
        const actionHandlers = {
          title: () => {
            target.title = payload as string
          },
          imageSrc: () => {
            target.imageSrc = payload as string
          },
        }
        const handler = actionHandlers[type]
        if (handler && target) {
          handler()
        }
      })
    ),
  clearContestContent: () =>
    set(() => ({
      contestContent: {
        left: {
          listId: "left",
          title: "",
          imageSrc: "",
          count: 0,
        },
        right: {
          listId: "right",
          title: "",
          imageSrc: "",
          count: 0,
        },
      },
    })),
  loadContestContent: (state) =>
    set(() => ({
      contestContent: state,
    })),
}))
