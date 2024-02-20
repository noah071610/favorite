import { PollingCandidateType, PollingLayoutType } from "@/_types/post/polling"
import { create } from "zustand"

interface States {
  layoutType: PollingLayoutType
  chartDescription: string
  pollingCandidates: PollingCandidateType[]
  selectedCandidate: PollingCandidateType | null
}

type Actions = {
  setSelectedCandidate: (state: States["selectedCandidate"]) => void
  addCandidate: (candidate: PollingCandidateType) => void
  moveCandidates: (targetListId: string, from: number, to: number) => void
  deleteCandidate: (listId: string) => void
  changeCandidate: (listId: string, state: { title?: string; description?: string; imageSrc?: string }) => void
  clearPollingContent: () => void
  setLayoutType: (layout: PollingLayoutType) => void
  setChartDescription: (description: string) => void
}

export const usePollingStore = create<States & Actions>((set) => ({
  pollingCandidates: [],
  selectedCandidate: null,
  layoutType: "textImage",
  chartDescription: "",
  setSelectedCandidate: (state) => set(() => ({ selectedCandidate: state })),
  addCandidate: (state) =>
    set((origin) => {
      return { pollingCandidates: [...origin.pollingCandidates, state] }
    }),
  moveCandidates: (targetListId, from, to) =>
    set((origin) => {
      // memo: 1. 위치 변경
      const _pollingCandidates = [...origin.pollingCandidates]
      const targetCandidate: PollingCandidateType = origin.pollingCandidates.find(
        ({ listId }) => listId === targetListId
      )!
      _pollingCandidates.splice(from, 1)
      _pollingCandidates.splice(to, 0, targetCandidate)

      // memo: 2. 넘버값 변경 (고유 인덱스)
      const pollingCandidates = _pollingCandidates.map((v, i) => ({ ...v, number: i + 1 }))

      // memo: 3. 작업중인 후보도 넘버 변경
      const selectedCandidate: PollingCandidateType | null = origin.selectedCandidate
      if (selectedCandidate) {
        selectedCandidate.number = pollingCandidates.find(({ listId }) => listId === selectedCandidate.listId)!.number
      }

      return {
        pollingCandidates,
        selectedCandidate,
      }
    }),
  changeCandidate: (targetListId, state) =>
    set((origin) => ({
      selectedCandidate: !origin.selectedCandidate ? null : { ...origin.selectedCandidate, ...state },
      pollingCandidates: origin.pollingCandidates.map((v) => (v.listId === targetListId ? { ...v, ...state } : v)),
    })),
  deleteCandidate: (targetListId) =>
    set((origin) => {
      // memo: 1. 삭제
      const pollingCandidates = origin.pollingCandidates
        .filter((v) => v.listId !== targetListId)
        .map((v, i) => ({ ...v, number: i + 1 }))

      // memo: 2. 선택된 후보가 만약 삭제되는 리스트라면 에디트 창을 닫아주고 아니면 넘버 변경
      let selectedCandidate: PollingCandidateType | null = origin.selectedCandidate
      if (selectedCandidate) {
        if (targetListId === origin.selectedCandidate?.listId) {
          selectedCandidate = null
        } else {
          selectedCandidate.number = pollingCandidates.find(
            ({ listId }) => listId === selectedCandidate?.listId
          )!.number
        }
      }

      return { pollingCandidates, selectedCandidate }
    }),
  clearPollingContent: () =>
    set(() => {
      return { pollingCandidates: [], selectedCandidate: null }
    }),
  setLayoutType: (layoutType) => set(() => ({ layoutType })),
  setChartDescription: (description) => set(() => ({ chartDescription: description })),
}))
