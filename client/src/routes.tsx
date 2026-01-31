import { createBrowserRouter } from "react-router";
// import App from './App';
import Login from "./features/auth/pages/Login";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
        errorElement: <div>404 not Found</div>,


    }
])