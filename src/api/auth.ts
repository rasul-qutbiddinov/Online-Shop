import instance from "./axios";

// Ro‘yxatdan o‘tish
export const registerUser = async (data: {
  username: string;
  password: string;
  email: string;
}) => {
  const res = await instance.post("/auth/register", data, {
    headers: {
      "Accept-Language": "uz",
    },
  });
  return res.data;
};

// Login qilish
export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  const res = await instance.post("/auth/login", data, {
    headers: {
      "Accept-Language": "uz",
    },
  });
  return res.data;
};
