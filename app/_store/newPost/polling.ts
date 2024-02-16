import { CandidateType } from "@/_types/post"
import { create } from "zustand"

interface States {
  newCandidates: CandidateType[]
  selectedCandidate: CandidateType | null
}

type Actions = {
  setSelectedCandidate: (state: States["selectedCandidate"]) => void
  addCandidate: (candidate: CandidateType) => void
  moveCandidates: (targetListId: string, from: number, to: number) => void
  deleteCandidate: (listId: string) => void
  changeCandidate: (listId: string, state: { title?: string; description?: string; imageSrc?: string }) => void
  clearCandidate: () => void
}

export const usePollingStore = create<States & Actions>((set) => ({
  newCandidates: [],
  selectedCandidate: null,
  setSelectedCandidate: (state) => set(() => ({ selectedCandidate: state })),
  addCandidate: (state) =>
    set((origin) => {
      return { newCandidates: [...origin.newCandidates, state] }
    }),
  moveCandidates: (targetListId, from, to) =>
    set((origin) => {
      // memo: 1. 위치 변경
      const _newCandidates = [...origin.newCandidates]
      const targetCandidate: CandidateType = origin.newCandidates.find(({ listId }) => listId === targetListId)!
      _newCandidates.splice(from, 1)
      _newCandidates.splice(to, 0, targetCandidate)

      // memo: 2. 넘버값 변경 (고유 인덱스)
      const newCandidates = _newCandidates.map((v, i) => ({ ...v, number: i + 1 }))

      // memo: 3. 작업중인 후보도 넘버 변경
      const selectedCandidate: CandidateType | null = origin.selectedCandidate
      if (selectedCandidate) {
        selectedCandidate.number = newCandidates.find(({ listId }) => listId === selectedCandidate.listId)!.number
      }

      return {
        newCandidates,
        selectedCandidate,
      }
    }),
  changeCandidate: (targetListId, state) =>
    set((origin) => ({
      selectedCandidate: !origin.selectedCandidate ? null : { ...origin.selectedCandidate, ...state },
      newCandidates: origin.newCandidates.map((v) => (v.listId === targetListId ? { ...v, ...state } : v)),
    })),
  deleteCandidate: (targetListId) =>
    set((origin) => {
      // memo: 1. 삭제
      const newCandidates = origin.newCandidates
        .filter((v) => v.listId !== targetListId)
        .map((v, i) => ({ ...v, number: i + 1 }))

      // memo: 2. 선택된 후보가 만약 삭제되는 리스트라면 에디트 창을 닫아주고 아니면 넘버 변경
      let selectedCandidate: CandidateType | null = origin.selectedCandidate
      if (selectedCandidate) {
        if (targetListId === origin.selectedCandidate?.listId) {
          selectedCandidate = null
        } else {
          selectedCandidate.number = newCandidates.find(({ listId }) => listId === selectedCandidate?.listId)!.number
        }
      }

      return { newCandidates, selectedCandidate }
    }),
  clearCandidate: () =>
    set(() => {
      return { newCandidates: [] }
    }),
}))
