import { useState } from "react";

type User = {
  name: string;
  email: string;
  role: string;
};

export const useUser = () => {
  const [user, setUserState] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const setUser = (data: User) => {
    setUserState(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem("user");
  };

  return { user, setUser, clearUser };
};
