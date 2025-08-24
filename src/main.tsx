import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./Router.tsx";
import { ConfigProvider, App } from "antd";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { CartProvider } from "./context/CartContext";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#edbd1e" },
        components: {
          Button: {
            borderRadius: 8,
            primaryShadow: "0px 0px 0px 1px rgba(10, 13, 18, 0.18) inset",
            controlHeight: 36,
          },
          Input: {
            boxShadow: "0px 0px 0px 1px rgba(10, 13, 18, 0.18)",
            controlHeight: 44,
          },
        },
      }}
    >
      <App>
        {" "}
        {/* 🔥 shu joy qo‘shilishi kerak */}
        <AuthProvider>
          <CartProvider>
            <RouterProvider router={createBrowserRouter(routes)} />
          </CartProvider>
        </AuthProvider>
      </App>
    </ConfigProvider>
  </QueryClientProvider>,
);
