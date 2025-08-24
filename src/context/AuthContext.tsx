/* eslint-disable @typescript-eslint/no-explicit-any */
// AuthContext.tsx
import { createContext } from "react";
export const AuthContext = createContext<{
  token: string | null;
  setToken: (token: string | null) => void;
  user: any; // YANGI
  setUser: (user: any) => void; // YANGI
}>({
  token: null,
  setToken: () => {},
  user: null,
  setUser: () => {},
});
