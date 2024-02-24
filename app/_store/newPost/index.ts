import { ErrorTypes } from "@/_types"
import { NewPostType, PostContentType, PostOptionType, PostingStatus, ThumbnailType } from "@/_types/post/post"
import { produce } from "immer"
import { create } from "zustand"

interface States {
  newPost: NewPostType | null
  newPostStatus: PostingStatus
  error: {
    type: ErrorTypes | null
    text?: string
  }
}

type SetNewPostAction =
  | { type: "type"; payload: PostContentType }
  | { type: "title"; payload: string }
  | { type: "description"; payload: string }
  | { type: "option"; payload: PostOptionType }
  | { type: "thumbnailType"; payload: ThumbnailType }
  | { type: "thumbnail"; payload: string }

type Actions = {
  createNewPost: (state: NewPostType) => void
  setStatus: (state: States["newPostStatus"]) => void
  setNewPost: (action: SetNewPostAction) => void
  setError: ({ type, text }: { type: ErrorTypes; text?: string }) => void
  clearNewPost: () => void
}

export const useNewPostStore = create<States & Actions>()((set) => ({
  newPost: null,
  newPostStatus: "init",
  error: {
    type: null,
    text: "",
  },
  setError: ({ type, text }) =>
    set(() => {
      if (type === "clear") {
        return { error: { type: null, text: "" } }
      } else {
        return { error: { type, text } }
      }
    }),
  setStatus: (state) => set(() => ({ newPostStatus: state })),
  createNewPost: (state) => set(() => ({ newPost: state })),
  setNewPost: (action) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.newPost) {
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
            option: () => {
              switch (action.payload) {
                case "isNoComments":
                  newPostDraft.info[action.payload] = newPostDraft.info[action.payload] === 0 ? 1 : 0
                  break
                case "isSecret":
                  newPostDraft.format = newPostDraft.format === "default" ? "secret" : "default"
                  break
                default:
                  break
              }
            },
            thumbnailType: () => {
              newPostDraft.info.thumbnailType = action.payload as ThumbnailType
            },
            thumbnail: () => {
              newPostDraft.thumbnail = action.payload
            },
          }

          const handler = actionHandlers[action.type]
          if (handler) {
            handler()
          }
        }
      })
    ),
  clearNewPost: () => set(() => ({ newPost: null, newPostStatus: "init" })),
}))
