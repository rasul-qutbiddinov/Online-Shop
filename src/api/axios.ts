import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // .env’dan olinyapti
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "uz", 
  },
});

// Request Interceptor
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`, // token qo‘shiladi
    };
  }
  return config;
});

// Response Interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // token muddati tugasa login pagega qaytaradi
    }
    return Promise.reject(error);
  },
);

export default instance;
