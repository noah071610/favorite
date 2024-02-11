import { CandidateType, PostType } from "@/_types/post"
import { create } from "zustand"

export type PostingStatus = "init" | "edit" | "result" | "rending"
export type CandidateDisplayType = "text" | "image" | "textImage"

interface States {
  newPost: PostType | null
  candidateDisplayType: CandidateDisplayType
  newCandidates: CandidateType[]
  selectedCandidate: CandidateType | null
  currentPostingPage: PostingStatus
}

type Actions = {
  setNewPost: (state: { [key: string]: any } | null) => void
  setCandidateDisplayType: (state: CandidateDisplayType) => void
  setSelectedCandidate: (state: States["selectedCandidate"]) => void
  setCurrentPostingPage: (state: States["currentPostingPage"]) => void
  addCandidate: (candidate: CandidateType) => void
  moveCandidates: (targetListId: string, from: number, to: number) => void
  deleteCandidate: (listId: string) => void
  changeCandidate: (listId: string, state: { title?: string; description?: string; imageSrc?: string }) => void
  clearCandidate: () => void
}

export const useNewPostStore = create<States & Actions>()((set) => ({
  newPost: null,
  candidateDisplayType: "textImage",
  newCandidates: [],
  selectedCandidate: null,
  currentPostingPage: "init",
  setNewPost: (state) =>
    set((origin) => ({ newPost: origin.newPost ? { ...origin.newPost, ...state } : (state as PostType) })),
  setCandidateDisplayType: (state) => set(() => ({ candidateDisplayType: state })),
  setSelectedCandidate: (state) => set(() => ({ selectedCandidate: state })),
  setCurrentPostingPage: (state) => set(() => ({ currentPostingPage: state })),
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
