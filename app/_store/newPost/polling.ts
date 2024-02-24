import { PollingCandidateType, PollingLayoutType } from "@/_types/post/polling"
import { produce } from "immer"
import { create } from "zustand"
import { PollingContentType } from "./../../_types/post/polling"

interface States {
  selectedCandidateIndex: number
  pollingContent: PollingContentType
}

type SetCandidateAction =
  | { index: number; type: "imageSrc"; payload: string }
  | { index: number; type: "title"; payload: string }
  | { index: number; type: "description"; payload: string }
  | { index: number; type: "delete"; payload: string }

type SetContentAction = { type: "chartDescription"; payload: string } | { type: "layout"; payload: PollingLayoutType }

type Actions = {
  loadPollingContent: (state: PollingContentType) => void
  setSelectedCandidateIndex: (index: number) => void
  setPollingCandidate: (action: SetCandidateAction) => void
  setPollingContent: (action: SetContentAction) => void
  clearPollingContent: () => void
  moveCandidate: ({ from, to }: { from: number; to: number }) => void
  addCandidate: ({ payload, index }: { payload: PollingCandidateType; index: number }) => void
}

export const usePollingStore = create<States & Actions>((set) => ({
  pollingContent: {
    chartDescription: "",
    layout: "textImage",
    candidates: [],
  },
  selectedCandidateIndex: -1,
  setSelectedCandidateIndex: (index) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.selectedCandidateIndex = index
      })
    ),
  moveCandidate: ({ from, to }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const candidates = draft.pollingContent.candidates
        const _target = { ...candidates[from] }
        candidates.splice(from, 1)
        candidates.splice(to, 0, _target)
        draft.selectedCandidateIndex = to
      })
    ),
  addCandidate: ({ payload, index }) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.pollingContent.candidates.push(payload as PollingCandidateType)
        draft.selectedCandidateIndex = index
      })
    ),
  setPollingCandidate: ({ index, payload, type }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const target = draft.pollingContent.candidates[index]
        const candidates = draft.pollingContent.candidates
        const actionHandlers = {
          title: () => {
            target.title = payload as string
          },
          description: () => {
            target.description = payload as string
          },
          imageSrc: () => {
            target.imageSrc = payload as string
          },
          delete: () => {
            draft.pollingContent.candidates = candidates.filter((_, i) => i !== index)

            if (draft.selectedCandidateIndex === index || candidates.length === 0) {
              draft.selectedCandidateIndex = -1
            }
            if (draft.selectedCandidateIndex > index) {
              draft.selectedCandidateIndex = draft.selectedCandidateIndex - 1
            }
          },
        }
        const handler = actionHandlers[type]
        if (handler && target) {
          handler()
        }
      })
    ),
  setPollingContent: ({ payload, type }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const content = draft.pollingContent
        const actionHandlers = {
          chartDescription: () => {
            content.chartDescription = payload as string
          },
          layout: () => {
            content.layout = payload as PollingLayoutType
          },
        }
        const handler = actionHandlers[type]
        if (handler) {
          handler()
        }
      })
    ),
  clearPollingContent: () =>
    set(() => ({
      pollingContent: {
        chartDescription: "",
        layout: "textImage",
        candidates: [],
      },
      selectedCandidateIndex: -1,
    })),

  loadPollingContent: (state) =>
    set(() => ({
      pollingContent: state,
      selectedCandidateIndex: -1,
    })),
}))
