"use client";

import { useState } from "react";
import bgImage from "../../../assets/hand-drawn-business-communication-concept.png";
import logo from "../../../assets/POSTVAULT.png";
import { Roboto } from "next/font/google";
import visible from "../../../assets/visible.png";
import hide from "../../../assets/hide.png";
import google from "../../../assets/google.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, UserLogIn } from "@/lib/validation";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUserInfoAsync } from "@/features/users/userInfoSlice";

const roboto = Roboto({
  weight: ["400", "700", "600", "500"],
  subsets: ["latin"],
});

export default function LoginPage() {
  const [sameUser, setsameUser] = useState();
  const [isHidden2, setIsHidden2] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(UserLogIn),
  });

  async function onSubmition(formdata: LoginFormData) {
    try {
      const response = await axios.post("/api/auth/login", formdata);
      if (response.status === 200) {
        //@ts-ignore
        dispatch(setUserInfoAsync({ email: formdata.email }));
        toast.success("User Logged in successfully!");
        router.replace("/home");
      }
    } catch (error: any) {
      console.log(error);
      setsameUser(error.response.data.message);
    }
  }

  return (
    <>
      <div className="max-w-full h-screen flex justify-center items-center bg-sky-200 p-8">
        <div className="bg-white rounded-xl w-full h-full flex">
          <div className="w-1/2 rounded-xl relative m-3 bg-sky-50">
            <img src={bgImage.src} className="w-full" />
            <h1 className={`text-center ${roboto.className} text-2xl`}>
              Every story deserves a safe place — welcome to
            </h1>
            <img src={logo.src} className="w-52 absolute -bottom-9 right-52 " />
          </div>
          <div
            className={`w-1/2 rounded-r-xl bg-white flex flex-col py-5 px-24 ${roboto.className}`}
          >
            <h1 className="text-[40px] font-medium">Welcome back!</h1>
            <p className="text-sm mt-2">Please enter log in details below</p>
            <form
              className="flex flex-col gap-3 mt-10"
              onSubmit={handleSubmit(onSubmition)}
            >
              <input
                {...register("email")}
                className="w-full h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400"
                placeholder="Email"
                type="email"
                name="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs -my-2 ">
                  {errors.email.message}
                </p>
              )}
              <div className="relative">
                <input
                  {...register("password")}
                  className="w-full h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400"
                  placeholder="Password"
                  type={isHidden2 ? "password" : "text"}
                  name="password"
                />
                <button
                  className="hover:cursor-pointer"
                  type="button"
                  onClick={() => setIsHidden2(!isHidden2)}
                >
                  <img
                    src={isHidden2 ? hide.src : visible.src}
                    className="w-6 absolute right-4 top-[10px]"
                  />
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs -my-2 ">
                  {errors.password.message}
                </p>
              )}
              <h1 className="text-end text-sm mb-3 hover:cursor-pointer">
                Forgot password?
              </h1>
              <button className="w-full h-11 rounded-md text-white bg-sky-600 mb-3 hover:cursor-pointer">
                Sign in
              </button>
            </form>
            <div className="flex justify-evenly items-center mb-3">
              <hr className=" flex-grow border-sky-400" />
              <h1 className="text-xs text-sky-400 mx-4">Or continue with</h1>
              <hr className=" flex-grow border-sky-400" />
            </div>
            <button className="w-full h-11 rounded-md text-white border-sky-600 border-[1px] hover:cursor-pointer">
              <div className="flex items-center justify-center gap-2 w-full h-full">
                <img src={google.src} className="w-5 h-5" />
                <span className="text-base text-sky-600">
                  Log in with Google
                </span>
              </div>
            </button>
            <h1 className="text-sm mt-6 text-center">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("signup")}
                className="text-sky-600 hover:cursor-pointer"
              >
                Sign Up
              </button>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
