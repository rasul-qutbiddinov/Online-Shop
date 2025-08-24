import ManageBooks from "./app/products/manage-products";
import LoginPage from "./app/Auth/LoginPage";
import { ProtectedRoute } from "@/auth/ProtectedRoutes";
import MainLayout from "./layouts/Layout";
import UserLayout from "./layouts/UserLayout";
import Addbooks from "./app/products/add-products";
import EditBook from "./app/products/EditProducts";
import ShopPage from "@/app/shop/ShopPage";
import ProfilePage from "@/app/profile/ProfilePage";
import { LangRedirect, RootRedirect } from "./auth/ProtectedRoutes";
import ProductDetailPage from "./app/shop/ProductDetailPage";
import RegisterPage from "./app/Auth/RegisterPage";
import Orders from "./app/orders/orders";
import Statistica from "./app/dashboard/statistica";
export const routes = [
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/:lang",
    element: <LangRedirect />,
    children: [
      // Admin Dashboard
      {
        path: "dashboard",
        element: <ProtectedRoute allowedRoles={["ADMIN"]} />, // <-- Katta harf
        children: [
          {
            path: "",
            element: <MainLayout />,
            children: [
              { path: "statistica", element: <Statistica /> },
              { path: "products", element: <ManageBooks /> },
              { path: "products/add-product", element: <Addbooks /> },
              { path: "products/edit/:id", element: <EditBook /> },
              { path: "orders", element: <Orders /> },
            ],
          },
        ],
      },
      // User pages
      {
        path: "",
        element: <ProtectedRoute allowedRoles={["USER"]} />, // <-- Katta harf
        children: [
          {
            path: "",
            element: <UserLayout />,
            children: [
              { path: "shop", element: <ShopPage /> },
              { path: "shop/:id", element: <ProductDetailPage /> },
              { path: "profile", element: <ProfilePage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: (
      <div className="flex h-screen w-full items-center justify-center">
        404 Not Found
      </div>
    ),
  },
];
