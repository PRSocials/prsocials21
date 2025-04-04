import { UserGuard } from "app";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { APP_BASE_PATH } from "app";

// Lazy load all pages
const App = lazy(() => import("../pages/App.tsx"));
const Analytics = lazy(() => import("../pages/Analytics.tsx"));
const Chat = lazy(() => import("../pages/Chat.tsx"));
const ConnectAccounts = lazy(() => import("../pages/ConnectAccounts.tsx"));
const Dashboard = lazy(() => import("../pages/Dashboard.tsx"));
const Logout = lazy(() => import("../pages/Logout.tsx"));
const Settings = lazy(() => import("../pages/Settings.tsx"));
const Subscriptions = lazy(() => import("../pages/Subscriptions.tsx"));

export const CustomRouter = () => {
  return (
    <BrowserRouter basename={APP_BASE_PATH}>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <Suspense>
              <App />
            </Suspense>
          }
        />
        
        {/* Analytics */}
        <Route
          path="/analytics"
          element={
            <Suspense>
              <UserGuard>
                <Analytics />
              </UserGuard>
            </Suspense>
          }
        />
        
        {/* Chat */}
        <Route
          path="/chat"
          element={
            <Suspense>
              <UserGuard>
                <Chat />
              </UserGuard>
            </Suspense>
          }
        />
        
        {/* ConnectAccounts */}
        <Route
          path="/connect-accounts"
          element={
            <Suspense>
              <UserGuard>
                <ConnectAccounts />
              </UserGuard>
            </Suspense>
          }
        />
        
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Suspense>
              <UserGuard>
                <Dashboard />
              </UserGuard>
            </Suspense>
          }
        />
        
        {/* Logout */}
        <Route
          path="/logout"
          element={
            <Suspense>
              <UserGuard>
                <Logout />
              </UserGuard>
            </Suspense>
          }
        />
        
        {/* Settings */}
        <Route
          path="/settings"
          element={
            <Suspense>
              <UserGuard>
                <Settings />
              </UserGuard>
            </Suspense>
          }
        />
        
        {/* Subscriptions */}
        <Route
          path="/subscriptions"
          element={
            <Suspense>
              <UserGuard>
                <Subscriptions />
              </UserGuard>
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
