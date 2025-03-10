import { create } from "zustand";
import { User } from "@/types";

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUser = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
