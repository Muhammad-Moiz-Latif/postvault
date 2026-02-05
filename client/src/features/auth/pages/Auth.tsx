import { useState } from "react"
import { SignUp } from "../components/Signup";
import Login from "../components/Login";
import { Outlet } from "react-router";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);

    console.log(isLogin);

    return (
        <div className="w-full h-screen bg-white">
            {isLogin ? <Login isLogin={isLogin} setLogin={setIsLogin} /> : <SignUp isLogin={isLogin} setLogin={setIsLogin} />}
            <Outlet/>
        </div>
    )
};
