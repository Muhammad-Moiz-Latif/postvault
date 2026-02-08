import { createBrowserRouter } from "react-router";
import App from "./App";
import Auth from "./features/auth/pages/Auth";
import { MainLayout } from "./layouts/MainLayout";
import { AuthGate } from "./components/AuthGate";
import ResetPassword from "./features/auth/components/resetPassword";
import { GoogleSuccess } from "./features/auth/components/ui/google-success";
import { Home } from "./features/user/pages/Home";
import { SideBarProvider } from "./context/sidebarContext";
import { CreatePost } from "./features/posts/pages/CreatePost";


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
                    element:
                        <SideBarProvider>
                            <MainLayout />
                        </SideBarProvider>,
                    children: [
                        {
                            index: true,
                            element: <Home />
                        },
                        {
                            path: 'posts/new',
                            element: <CreatePost />
                        }
                    ]
                }
            ]
        }
    ])