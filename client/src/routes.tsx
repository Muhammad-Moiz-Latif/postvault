import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import Auth from "./features/auth/pages/Auth";
import { MainLayout } from "./layouts/MainLayout";
import ResetPassword from "./features/auth/components/resetPassword";
import { GoogleSuccess } from "./features/auth/components/ui/google-success";
import { Home } from "./features/user/pages/Home";
import { SideBarProvider } from "./context/sidebarContext";
import { CreatePost } from "./features/posts/pages/CreatePost";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import { DetailPost } from "./features/posts/pages/DetailPost";
import MyPosts from "./features/user/pages/MyPosts";
import { EditPost } from "./features/user/pages/EditPosts";


export const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <App />,
            errorElement: <div>404 not Found</div>,
            children: [
                {
                    index: true,
                    element: <Navigate to='/auth' replace />
                },
                {
                    path: 'auth',
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
                    path: "/app",
                    element: <ProtectedRoute />,
                    children: [
                        {
                            element: (
                                <SideBarProvider>
                                    <MainLayout />
                                </SideBarProvider>
                            ),
                            children: [
                                {
                                    index: true,
                                    element: <Home />,
                                },
                                {
                                    path: ":postId",
                                    element: <DetailPost />
                                },
                                {
                                    path: "posts/new",
                                    element: <CreatePost />,
                                },
                                {
                                    path: "posts",
                                    element: <MyPosts />,
                                },
                                {
                                    path: "posts/edit/:postId",
                                    element: <EditPost />
                                }
                            ],
                        },
                    ],
                }
            ]
        }
    ])