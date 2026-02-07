import { createBrowserRouter } from "react-router";
import App from "./App";
import Auth from "./features/auth/pages/Auth";
import { MainLayout } from "./layouts/MainLayout";
import { AuthGate } from "./components/AuthGate";
import ResetPassword from "./features/auth/components/resetPassword";
import { GoogleSuccess } from "./features/auth/components/ui/google-success";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { Dashboard } from "./features/user/pages/Dashboard";


export const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <App />,
            errorElement: <div>404 not Found</div>,
            children: [
                {
                    element: <AuthGate />,
                    index: true
                },
                {
                    path: '/auth',
                    element: <Auth />,
                    children: [
                        {
                            path: 'success',
                            element: <GoogleSuccess />,
                            index: true
                        }
                    ]
                },
                {
                    path: '/reset-password',
                    element: <ResetPassword />
                },
                {
                    path: '/app',
                    element: <MainLayout />,
                    children: [
                        {
                            index: true,
                            element: <Dashboard />
                        }
                    ]
                }
            ]
        }
    ])