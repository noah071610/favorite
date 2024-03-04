import { PostCardType } from "@/_types/post/post"
import { create } from "zustand"

interface States {
  searchPosts: PostCardType[]
  isSearching: boolean
  sharePost: PostCardType | null
  searchQuery: string
}

type Actions = {
  setSearchPosts: (posts: PostCardType[]) => void
  setIsSearching: (b: boolean) => void
  setSearchQuery: (str: string) => void
  setSharePost: (str: PostCardType) => void
}

export const usePostStore = create<States & Actions>()((set) => ({
  searchPosts: [],
  isSearching: false,
  searchQuery: "",
  sharePost: null,
  setSearchPosts: (posts) => set(() => ({ searchPosts: posts })),
  setIsSearching: (b) => set(() => ({ isSearching: b })),
  setSearchQuery: (str) => set(() => ({ searchQuery: str })),
  setSharePost: (post) => set(() => ({ sharePost: post })),
}))
