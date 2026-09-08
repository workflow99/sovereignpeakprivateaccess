import { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppStoreProvider } from "./store/AppStoreContext";
import { ToastProvider } from "./components/ToastProvider";
import ToastContainer from "./components/ToastContainer";
import ToastBridge from "./components/ToastBridge";
import RocketLoader from "./components/RocketLoader";
import RequireAuth from "./components/RequireAuth";
import AdminGuard from "./components/AdminGuard";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";
import PortfolioPage from "./pages/dashboard/PortfolioPage";
import TransactionsPage from "./pages/dashboard/TransactionsPage";
import CardsPage from "./pages/dashboard/CardsPage";
import DepositPage from "./pages/dashboard/DepositPage";
import LoansPage from "./pages/dashboard/LoansPage";
import SupportPage from "./pages/dashboard/SupportPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import LinkPage from "./pages/dashboard/LinkPage";
import AdminLayout from "./pages/AdminLayout";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminUserDetailPage from "./pages/admin/AdminUserDetailPage";
import AdminChatPage from "./pages/admin/AdminChatPage";

function RouteTransitionLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  // Stores the previous pathname (not a boolean) so this stays correct even
  // under StrictMode's dev-only double-invocation of effects: repeated
  // invocations with an unchanged pathname are a no-op either way.
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (prevPathRef.current === location.pathname) return;
    prevPathRef.current = location.pathname;
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <RocketLoader visible={loading} />;
}

function App() {
  return (
    <AppStoreProvider>
      <ToastProvider>
        <ToastContainer />
        <ToastBridge />
        <RouteTransitionLoader />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />

          <Route path="/dashboard" element={<RequireAuth />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="cards" element={<CardsPage />} />
              <Route path="deposit" element={<DepositPage />} />
              <Route path="loans" element={<LoansPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="link" element={<LinkPage />} />
            </Route>
          </Route>

          <Route path="/admin" element={<Navigate to="/superadmin" replace />} />

          <Route path="/superadmin" element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="users/:userId" element={<AdminUserDetailPage />} />
              <Route path="chat" element={<AdminChatPage />} />
            </Route>
          </Route>
        </Routes>
      </ToastProvider>
    </AppStoreProvider>
  );
}

export default App;
