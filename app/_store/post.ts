import { create } from "zustand"

interface States {
  postLoaded: boolean
}

type Actions = {
  setPostLoaded: (state: States["postLoaded"]) => void
}

export const usePostStore = create<States & Actions>()((set) => ({
  postLoaded: false,
  setPostLoaded: (state) => set(() => ({ postLoaded: state })),
}))
