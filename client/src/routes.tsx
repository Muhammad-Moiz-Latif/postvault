import { createBrowserRouter } from "react-router";
import App from "./App";
import Auth from "./features/auth/pages/Auth";
import { MainLayout } from "./layouts/MainLayout";
import { AuthGate } from "./features/auth/components/AuthGate";


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
                    index: true
                },
                {
                    path: '/app',
                    element: <MainLayout />
                }
            ]
        }
    ])