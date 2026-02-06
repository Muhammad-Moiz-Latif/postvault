import { useState } from "react"
import { SignUp } from "../components/Signup";
import Login from "../components/Login";
import { Outlet } from "react-router";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="w-full h-screen bg-white relative">
            {isLogin ? <Login isLogin={isLogin} setLogin={setIsLogin} /> : <SignUp isLogin={isLogin} setLogin={setIsLogin} />}
            <Outlet />
        </div>
    )
};
