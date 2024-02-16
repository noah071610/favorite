import { NewPostType } from "@/_types/post/post"
import { produce } from "immer"
import { create } from "zustand"

export type PostingStatus = "init" | "edit" | "result" | "rending"
export type PostContentType = "polling" | "contest" | "tournament"
export type PollingLayoutType = "text" | "image" | "textImage"
export type ThumbnailType = "custom" | "layout" | "none"
export type PostOptionType = "isSecret" | "isNoComments"

interface States {
  newPost: NewPostType | null
  newPostStatus: PostingStatus
}

type SetNewPostAction =
  | { type: "type"; payload: PostContentType }
  | { type: "layout"; payload: PollingLayoutType }
  | { type: "title"; payload: string }
  | { type: "description"; payload: string }
  | { type: "chartDescription"; payload: string }
  | { type: "option"; payload: PostOptionType }
  | { type: "thumbnailType"; payload: ThumbnailType }
  | { type: "thumbnail"; payload: string }

type Actions = {
  createNewPost: (state: NewPostType) => void
  setStatus: (state: States["newPostStatus"]) => void
  setNewPost: (action: SetNewPostAction) => void
}

export const useNewPostStore = create<States & Actions>()((set) => ({
  newPost: null,
  newPostStatus: "init",
  setStatus: (state) => set(() => ({ newPostStatus: state })),
  createNewPost: (state) => set(() => ({ newPost: state })),
  setNewPost: (action) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.newPost) {
          switch (action.type) {
            case "title":
              draft.newPost.title = action.payload
              break
            case "description":
              draft.newPost.description = action.payload
              break
            case "layout":
              draft.newPost.content.layout = action.payload
              break
            case "type":
              draft.newPost.type = action.payload
              break
            case "option":
              switch (action.payload) {
                case "isNoComments":
                  draft.newPost.info[action.payload] = draft.newPost.info[action.payload] === 0 ? 1 : 0
                  break
                case "isSecret":
                  draft.newPost.format = draft.newPost.format === "default" ? "secret" : "default"
                  break
                default:
                  break
              }
              break
            case "thumbnailType":
              draft.newPost.info.thumbnailType = action.payload
              break
            case "thumbnail":
              draft.newPost.thumbnail = action.payload
              break
            case "chartDescription":
              draft.newPost.content.chartDescription = action.payload
              break
            default:
              break
          }
        }
      })
    ),
}))
