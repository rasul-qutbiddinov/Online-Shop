import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { token, user } = useAuth();
  const location = useLocation();
  const lang = user ? "uz" : "uz"; // token bo'lsa default lang

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role?.toUpperCase();
  const roles = allowedRoles?.map((r) => r.toUpperCase());

  if (allowedRoles && (!userRole || !roles?.includes(userRole))) {
    return <Navigate to={`/${lang}/shop`} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export function RootRedirect() {
  return <Navigate to="/uz/dashboard/products" replace />;
}

export function LangRedirect() {
  return <Outlet />;
}
