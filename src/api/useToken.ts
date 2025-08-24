import { create } from "zustand";

type TokenState = {
  token: string | null;
  setToken: (token: string) => void;
};

export const useToken = create<TokenState>((set) => ({
  token: localStorage.getItem("token"),
  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },
}));
