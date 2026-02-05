import { createBrowserRouter } from "react-router";
import App from "./App";
import Auth from "./features/auth/pages/Auth";
import { MainLayout } from "./layouts/MainLayout";
import { AuthGate } from "./features/auth/components/AuthGate";
import ResetPassword from "./features/auth/components/resetPassword";


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
                },
                {
                    path: '/reset-password',
                    element: <ResetPassword />
                },
                {
                    path: '/app',
                    element: <MainLayout />
                }
            ]
        }
    ])