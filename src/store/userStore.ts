import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserStoreState {
  user: User | null;
  setUser: (user: User) => void;
}

const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;
