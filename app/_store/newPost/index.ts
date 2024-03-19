import { LangType } from "@/_types"
import {
  CandidateType,
  ContentLayoutType,
  PostContentType,
  PostFormatType,
  PostingStatus,
  ThumbnailSettingType,
  ThumbnailType,
} from "@/_types/post"
import { produce } from "immer"
import { create } from "zustand"

export interface NewPostStates {
  postId: string
  type: PostContentType | "none"
  thumbnail: string
  title: string
  description: string
  format: PostFormatType
  lang: LangType
  count: number
  content: {
    layout: ContentLayoutType
    resultDescription: string
    newPostStatus: PostingStatus
    candidates: CandidateType[]
    thumbnail: ThumbnailSettingType
    selectedCandidateIndex: number
    isEditOn: boolean
  }
}

type SetNewPostAction =
  | { type: "type"; payload: PostContentType }
  | { type: "title"; payload: string }
  | { type: "description"; payload: string }
  | { type: "format"; payload: string }
  | { type: "lang"; payload: LangType }

type SetThumbnailAction =
  | { type: "type"; payload: ThumbnailType }
  | { type: "imageSrc"; payload: string }
  | { type: "isPossibleLayout"; payload: boolean }

type SetCandidateAction =
  | { index: number; type: "imageSrc"; payload: string }
  | { index: number; type: "title"; payload: string }
  | { index: number; type: "description"; payload: string }

type SetContentAction = { type: "resultDescription"; payload: string } | { type: "layout"; payload: ContentLayoutType }

type Actions = {
  setCandidate: (action: SetCandidateAction) => void
  setSelectedCandidateIndex: (state: number) => void
  moveCandidate: ({ from, to }: { from: number; to: number }) => void
  addCandidate: ({ payload }: { payload: CandidateType }) => void
  deleteCandidate: ({ index }: { index: number }) => void
  loadNewPost: (state: NewPostStates) => void
  clearNewPost: (postId: string, type: PostContentType, lang: LangType) => void
  setStatus: (state: PostingStatus) => void
  setNewPost: (action: SetNewPostAction) => void
  setContent: (action: SetContentAction) => void
  setThumbnail: (action: SetThumbnailAction) => void
  setThumbnailLayout: ({ slice, isSetThumbnail }: { slice: number; isSetThumbnail?: boolean }) => void
}

export const useNewPostStore = create<NewPostStates & Actions>()((set) => ({
  postId: "",
  type: "none",
  thumbnail: "",
  title: "",
  description: "",
  format: "editing",
  count: 0,
  lang: "ko",
  content: {
    layout: "textImage",
    resultDescription: "",
    newPostStatus: "init",
    candidates: [],
    thumbnail: {
      imageSrc: "",
      type: "custom",
      layout: [],
      slice: 0,
      isPossibleLayout: false,
    },
    selectedCandidateIndex: -1,
    isEditOn: false,
  },

  moveCandidate: ({ from, to }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const candidates = draft.content.candidates
        const _target = { ...candidates[from] }
        candidates.splice(from, 1)
        candidates.splice(to, 0, _target)
        draft.content.selectedCandidateIndex = -1
        draft.content.isEditOn = true
      })
    ),
  addCandidate: ({ payload }) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.content.candidates.push(payload as CandidateType)
        draft.content.thumbnail.slice = draft.content.candidates.length > 5 ? 5 : draft.content.candidates.length
        draft.content.isEditOn = true
      })
    ),
  deleteCandidate: ({ index }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const candidates = draft.content.candidates

        draft.content.candidates = candidates.filter((_: any, i: number) => i !== index)

        draft.content.selectedCandidateIndex = -1

        draft.content.thumbnail.slice = draft.content.candidates.length
        draft.content.isEditOn = true
      })
    ),
  setCandidate: ({ index, payload, type }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const target = draft.content.candidates[index]
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
        }
        const handler = actionHandlers[type]
        if (handler && target) {
          handler()
          draft.content.isEditOn = true
        }
      })
    ),

  setNewPost: (action) =>
    set((origin) =>
      produce(origin, (draft) => {
        const actionHandlers = {
          title: () => {
            draft.title = action.payload
            draft.content.isEditOn = true
          },
          description: () => {
            draft.description = action.payload
            draft.content.isEditOn = true
          },
          type: () => {
            draft.type = action.payload as PostContentType
          },
          lang: () => {
            draft.lang = action.payload as LangType
            draft.content.isEditOn = true
          },
          format: () => {
            draft.format = action.payload as PostFormatType
            draft.content.isEditOn = true
          },
        }

        const handler = actionHandlers[action.type]
        if (handler) {
          handler()
        }
      })
    ),

  setContent: ({ payload, type }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const content = draft.content
        const actionHandlers = {
          resultDescription: () => {
            content.resultDescription = payload as string
          },
          layout: () => {
            content.layout = payload as ContentLayoutType
          },
        }
        const handler = actionHandlers[type]
        if (handler) {
          handler()
          draft.content.isEditOn = true
        }
      })
    ),

  setThumbnail: (action) =>
    set((origin) =>
      produce(origin, (draft) => {
        const actionHandlers = {
          imageSrc: () => {
            draft.content.thumbnail.imageSrc = action.payload as string
            draft.thumbnail = action.payload as string
          },
          type: () => {
            draft.content.thumbnail.type = action.payload as ThumbnailType
            if (draft.content.thumbnail.type === "custom") {
              draft.thumbnail = draft.content.thumbnail.imageSrc as string
            }
            if (draft.content.thumbnail.type === "layout") {
              const layoutArr = draft.content.candidates
                .slice(0, draft.content.thumbnail.slice)
                .map(({ imageSrc }) => imageSrc)
              draft.thumbnail = layoutArr.join("${}$")
            }
            if (draft.content.thumbnail.type === "none") {
              draft.thumbnail = ""
            }
          },
          isPossibleLayout: () => {
            draft.content.thumbnail.isPossibleLayout = action.payload as boolean
          },
        }

        const handler = actionHandlers[action.type]
        if (handler) {
          handler()
          draft.content.isEditOn = true
        }
      })
    ),

  setThumbnailLayout: ({ slice, isSetThumbnail }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const layoutArr = draft.content.candidates.slice(0, slice).map(({ imageSrc }) => imageSrc)
        draft.content.thumbnail.slice = slice
        draft.content.thumbnail.layout = layoutArr
        draft.content.isEditOn = true
        if (isSetThumbnail) {
          draft.thumbnail = layoutArr.join("${}$")
        }
      })
    ),

  setStatus: (state) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.content.newPostStatus = state
        draft.content.isEditOn = true
      })
    ),

  loadNewPost: (state) =>
    set(() => ({
      ...state,
    })),
  clearNewPost: (postId, type, lang) =>
    set(() => {
      return {
        postId,
        type,
        thumbnail: "",
        title: "",
        description: "",
        format: "editing",
        count: 0,
        lang,
        content: {
          layout: "textImage",
          resultDescription: "",
          newPostStatus: "init",
          candidates:
            type === "contest"
              ? [
                  {
                    listId: "left",
                    title: "",
                    description: "",
                    imageSrc: "",
                    lose: 0,
                    win: 0,
                    number: 1,
                    pick: 0,
                  },
                  {
                    listId: "right",
                    title: "",
                    description: "",
                    imageSrc: "",
                    lose: 0,
                    win: 0,
                    number: 2,
                    pick: 0,
                  },
                ]
              : [],
          thumbnail: {
            imageSrc: "",
            type: "custom",
            layout: [],
            slice: 0,
            isPossibleLayout: false,
          },
          selectedCandidateIndex: -1,
          isEditOn: true,
        },
      }
    }),
  setSelectedCandidateIndex: (state) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.content.selectedCandidateIndex = state
        draft.content.isEditOn = true
      })
    ),
}))
