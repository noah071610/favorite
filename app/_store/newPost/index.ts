import { ErrorTypes } from "@/_types"
import { PollingCandidateType, PollingLayoutType } from "@/_types/post/polling"
import { NewPostType, PostContentType, PostingStatus, ThumbnailType } from "@/_types/post/post"
import { produce } from "immer"
import { create } from "zustand"

export interface ThumbnailSettingType {
  imageSrc: string
  type: ThumbnailType
  layout: string[]
  slice: number
}

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
  isEditOn: boolean
  error: {
    type: ErrorTypes | null
    text?: string
  }
}

type SetNewPostAction =
  | { type: "type"; payload: PostContentType }
  | { type: "title"; payload: string }
  | { type: "description"; payload: string }
  | { type: "format"; payload: string }

type SetThumbnailAction = { type: "type"; payload: ThumbnailType } | { type: "imageSrc"; payload: string }

type SetCandidateAction =
  | { index: number; type: "imageSrc"; payload: string }
  | { index: number; type: "title"; payload: string }
  | { index: number; type: "description"; payload: string }

type SetContentAction = { type: "resultDescription"; payload: string } | { type: "layout"; payload: PollingLayoutType }

type Actions = {
  setCandidate: (action: SetCandidateAction) => void
  setSelectedCandidateIndex: (state: number) => void
  moveCandidate: ({ from, to }: { from: number; to: number }) => void
  addCandidate: ({ payload, index }: { payload: any; index: number }) => void
  deleteCandidate: ({ index }: { index: number }) => void
  loadNewPost: (state: {
    newPost: NewPostType
    content: { [key: string]: any }
    candidates: { [key: string]: any }[]
    thumbnail: ThumbnailSettingType
  }) => void
  setStatus: (state: States["newPostStatus"]) => void
  setNewPost: (action: SetNewPostAction) => void
  setContent: (action: SetContentAction) => void
  setThumbnail: (action: SetThumbnailAction) => void
  setIsEditOn: (b: boolean) => void
  setThumbnailLayout: ({ slice, isShuffle }: { slice: number; isShuffle?: boolean }) => void
  setError: ({ type, text }: { type: ErrorTypes; text?: string }) => void
  clearNewPost: (type: PostContentType | "all") => void
}

export const useNewPostStore = create<States & Actions>()((set) => ({
  newPost: newPostInit,
  isEditOn: false,
  content: {},
  candidates: [],
  newPostStatus: "init",
  thumbnail: {
    imageSrc: "",
    type: "custom",
    layout: [],
    slice: 0,
  },
  error: {
    type: null,
    text: "",
  },
  selectedCandidateIndex: -1,

  moveCandidate: ({ from, to }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const candidates = draft.candidates
        const _target = { ...candidates[from] }
        candidates.splice(from, 1)
        candidates.splice(to, 0, _target)
        draft.selectedCandidateIndex = to
      })
    ),
  addCandidate: ({ payload, index }) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.candidates.push(payload as PollingCandidateType)
        draft.selectedCandidateIndex = index
        draft.thumbnail.slice = draft.candidates.length > 5 ? 5 : draft.candidates.length
      })
    ),
  deleteCandidate: ({ index }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const candidates = draft.candidates

        draft.candidates = candidates.filter((_: any, i: number) => i !== index)

        if (draft.selectedCandidateIndex === index || candidates.length === 0) {
          draft.selectedCandidateIndex = -1
        }
        if (draft.selectedCandidateIndex > index) {
          draft.selectedCandidateIndex = draft.selectedCandidateIndex - 1
        }

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
            content.layout = payload as PollingLayoutType
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
      newPost: state.newPost,
      content: state.content,
      candidates: state.candidates,
      thumbnail: state.thumbnail,
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
        },
      }
    }),
  setSelectedCandidateIndex: (state) =>
    set(() => ({
      selectedCandidateIndex: state,
    })),
  setIsEditOn: (state) =>
    set(() => ({
      isEditOn: state,
    })),
  setError: ({ type, text }) =>
    set(() => {
      if (type === "clear") {
        return { error: { type: null, text: "" } }
      } else {
        return { error: { type, text } }
      }
    }),
}))
