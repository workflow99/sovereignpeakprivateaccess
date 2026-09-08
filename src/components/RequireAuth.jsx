import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppStore } from "../store/AppStoreContext";

export default function RequireAuth() {
  const { state } = useAppStore();
  const location = useLocation();

  if (!state.session.userId) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
