import { PollingCandidateType } from "@/_types/post/polling"
import {
  ContentLayoutType,
  NewPostType,
  PostContentType,
  PostingStatus,
  ThumbnailSettingType,
  ThumbnailType,
} from "@/_types/post/post"
import { produce } from "immer"
import { create } from "zustand"

const newPostInit: NewPostType = {
  postId: "newPost",
  type: null,
  thumbnail: "",
  title: "",
  description: "",
  format: "default",
  count: 0,
}

interface States {
  newPost: NewPostType
  content: { [key: string]: any }
  candidates: { [key: string]: any }[]
  newPostStatus: PostingStatus
  selectedCandidateIndex: number
  thumbnail: ThumbnailSettingType
}

type SetNewPostAction =
  | { type: "type"; payload: PostContentType }
  | { type: "title"; payload: string }
  | { type: "description"; payload: string }
  | { type: "format"; payload: string }

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
  addCandidate: ({ payload, index }: { payload: any; index: number }) => void
  deleteCandidate: ({ index }: { index: number }) => void
  loadNewPost: (state: any) => void
  setStatus: (state: States["newPostStatus"]) => void
  setNewPost: (action: SetNewPostAction) => void
  setContent: (action: SetContentAction) => void
  setThumbnail: (action: SetThumbnailAction) => void
  setThumbnailLayout: ({ slice, isShuffle }: { slice: number; isShuffle?: boolean }) => void
  clearNewPost: (type: PostContentType | "all") => void
}

export const useNewPostStore = create<States & Actions>()((set) => ({
  newPost: newPostInit,
  content: {},
  candidates: [],
  newPostStatus: "init",
  thumbnail: {
    imageSrc: "",
    type: "custom",
    layout: [],
    slice: 0,
    isPossibleLayout: false,
  },
  selectedCandidateIndex: -1,

  moveCandidate: ({ from, to }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const candidates = draft.candidates
        const _target = { ...candidates[from] }
        candidates.splice(from, 1)
        candidates.splice(to, 0, _target)
        draft.selectedCandidateIndex = -1
      })
    ),
  addCandidate: ({ payload, index }) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.candidates.push(payload as PollingCandidateType)
        draft.thumbnail.slice = draft.candidates.length > 5 ? 5 : draft.candidates.length
      })
    ),
  deleteCandidate: ({ index }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const candidates = draft.candidates

        draft.candidates = candidates.filter((_: any, i: number) => i !== index)

        draft.selectedCandidateIndex = -1

        draft.thumbnail.slice = draft.candidates.length
      })
    ),
  setCandidate: ({ index, payload, type }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const target = draft.candidates[index]
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
        }
      })
    ),

  setNewPost: (action) =>
    set((origin) =>
      produce(origin, (draft) => {
        const newPostDraft = draft.newPost
        const actionHandlers = {
          title: () => {
            newPostDraft.title = action.payload
          },
          description: () => {
            newPostDraft.description = action.payload
          },
          type: () => {
            newPostDraft.type = action.payload as PostContentType
          },
          format: () => {
            switch (action.payload) {
              case "isSecret":
                newPostDraft.format = newPostDraft.format === "default" ? "secret" : "default"
                break
              default:
                break
            }
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
        }
      })
    ),

  setThumbnail: (action) =>
    set((origin) =>
      produce(origin, (draft) => {
        const actionHandlers = {
          imageSrc: () => {
            draft.thumbnail.imageSrc = action.payload as string
          },
          type: () => {
            draft.thumbnail.type = action.payload as ThumbnailType
          },
          isPossibleLayout: () => {
            draft.thumbnail.isPossibleLayout = action.payload as boolean
          },
        }

        const handler = actionHandlers[action.type]
        if (handler) {
          handler()
        }
      })
    ),

  setThumbnailLayout: ({ slice }) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.thumbnail.slice = slice
        draft.thumbnail.layout = draft.candidates.slice(0, slice).map(({ imageSrc }) => imageSrc)
      })
    ),

  setStatus: (state) => set(() => ({ newPostStatus: state })),
  loadNewPost: (state) =>
    set(() => ({
      ...state,
    })),
  clearNewPost: (type) =>
    set(() => {
      let [content, candidates] = [{}, []] as any[]
      switch (type) {
        case "polling":
          content = {
            layout: "textImage",
            resultDescription: "",
          }
          break
        case "contest":
          candidates = [
            {
              listId: "left",
              title: "",
              imageSrc: "",
              pick: 0,
              number: 1,
            },
            {
              listId: "right",
              title: "",
              imageSrc: "",
              pick: 0,
              number: 2,
            },
          ]
          break
        default:
          break
      }
      return {
        newPost: newPostInit,
        content,
        candidates,
        thumbnail: {
          imageSrc: "",
          type: "custom",
          layout: [],
          slice: type === "contest" ? 2 : 0,
          isPossibleLayout: false,
        },
      }
    }),
  setSelectedCandidateIndex: (state) =>
    set(() => ({
      selectedCandidateIndex: state,
    })),
}))
