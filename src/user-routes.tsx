
// THIS FILE IS AUTOGENERATED WHEN PAGES ARE UPDATED
import { lazy } from "react";
import { RouteObject } from "react-router";


import { UserGuard } from "app";


const Analytics = lazy(() => import("./pages/Analytics.tsx"));
const App = lazy(() => import("./pages/App.tsx"));
const Chat = lazy(() => import("./pages/Chat.tsx"));
const ConfigPage = lazy(() => import("./pages/ConfigPage.tsx"));
const ConnectAccounts = lazy(() => import("./pages/ConnectAccounts.tsx"));
const CustomRouter = lazy(() => import("./pages/CustomRouter.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Logout = lazy(() => import("./pages/Logout.tsx"));
const PublicLogin = lazy(() => import("./pages/PublicLogin.tsx"));
const PublicSignUp = lazy(() => import("./pages/PublicSignUp.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));
const SignUp = lazy(() => import("./pages/SignUp.tsx"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess.tsx"));
const Subscriptions = lazy(() => import("./pages/Subscriptions.tsx"));

export const userRoutes: RouteObject[] = [

	{ path: "/analytics", element: <UserGuard><Analytics /></UserGuard>},
	{ path: "/", element: <App />},
	{ path: "/chat", element: <UserGuard><Chat /></UserGuard>},
	{ path: "/config-page", element: <UserGuard><ConfigPage /></UserGuard>},
	{ path: "/configpage", element: <UserGuard><ConfigPage /></UserGuard>},
	{ path: "/connect-accounts", element: <UserGuard><ConnectAccounts /></UserGuard>},
	{ path: "/connectaccounts", element: <UserGuard><ConnectAccounts /></UserGuard>},
	{ path: "/custom-router", element: <UserGuard><CustomRouter /></UserGuard>},
	{ path: "/customrouter", element: <UserGuard><CustomRouter /></UserGuard>},
	{ path: "/dashboard", element: <UserGuard><Dashboard /></UserGuard>},
	{ path: "/login", element: <Login />},
	{ path: "/logout", element: <UserGuard><Logout /></UserGuard>},
	{ path: "/public-login", element: <UserGuard><PublicLogin /></UserGuard>},
	{ path: "/publiclogin", element: <UserGuard><PublicLogin /></UserGuard>},
	{ path: "/public-sign-up", element: <UserGuard><PublicSignUp /></UserGuard>},
	{ path: "/publicsignup", element: <UserGuard><PublicSignUp /></UserGuard>},
	{ path: "/settings", element: <UserGuard><Settings /></UserGuard>},
	{ path: "/sign-up", element: <SignUp />},
	{ path: "/signup", element: <SignUp />},
	{ path: "/subscription-success", element: <UserGuard><SubscriptionSuccess /></UserGuard>},
	{ path: "/subscriptionsuccess", element: <UserGuard><SubscriptionSuccess /></UserGuard>},
	{ path: "/subscriptions", element: <UserGuard><Subscriptions /></UserGuard>},

];
