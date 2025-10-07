'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSignIn, SignInFormData } from "@/lib/validation";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/features/users/userInfoSlice";

import bgImage from "../../../assets/hand-drawn-business-communication-concept.png";
import logo from "../../../assets/POSTVAULT.png";
import visible from "../../../assets/visible.png";
import hide from "../../../assets/hide.png";
import google from "../../../assets/google.png";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "700", "600", "500"],
  subsets: ["latin"],
});

export default function SigninPage() {
  const [sameUser, setsameUser] = useState<string>();
  const [isHidden1, setIsHidden1] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(UserSignIn),
  });

  async function onSubmit(formdata: SignInFormData) {
    try {
      const response = await axios.post("/api/auth/signin", formdata);
      if (response.status === 200) {
        dispatch(setUserInfo({ username: formdata.username, email: formdata.email }));
        toast.success("User created successfully!");
        router.replace("/home");
      }
    } catch (error: any) {
      setsameUser(error.response?.data?.message);
    }
  }

  async function handleGoogleSignIn() {
    const { signIn } = await import("next-auth/react");
    signIn("google", { callbackUrl: "/home" });
  }

  return (
    <div className="max-w-full h-screen flex justify-center items-center bg-sky-200 sm:p-5 md:p-8">
      <div className="bg-white rounded-xl w-full h-full flex">
        {/* Left Side */}
        <div className="hidden md:block w-1/2 rounded-xl relative m-3 bg-sky-50">
          <img src={bgImage.src} className="w-full" />
          <h1 className={`text-center ${roboto.className} text-2xl`}>
            Every story deserves a safe place — welcome to
          </h1>
          <img src={logo.src} className="w-52 absolute -bottom-9 right-52 " />
        </div>
        {/* Right Side */}
        <div className={`w-1/2 relative rounded-xl md:rounded-r-xl bg-white flex flex-1 md:flex flex-col py-6 px-3 md:py-5 md:px-24 ${roboto.className}`}>
          <h1 className="text-2xl text-center md:text-start md:text-[40px] font-medium">
            Create an account
          </h1>
          <h1 className="text-xs text-center md:text-start md:text-sm mt-2">
            Already have an account?{" "}
            <button onClick={() => router.push("login")} className="text-sky-600 hover:cursor-pointer">
              Log in
            </button>
          </h1>
          <p className="text-xs text-red-500 absolute top-30">{sameUser}</p>
          <form className="flex flex-col gap-2 mt-6 md:gap-3 md:mt-10" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* username */}
            <input {...register("username")} placeholder="Username" className="w-full h-9 md:h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400 placeholder:text-sm text-sm md:placeholder:text-lg md:text-lg" />
            {errors.username && <p className="text-red-500 text-xs -my-2">{errors.username.message}</p>}
            {/* email */}
            <input {...register("email")} placeholder="Email" type="email" className="w-full h-9 md:h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400 placeholder:text-sm text-sm md:placeholder:text-lg md:text-lg" />
            {errors.email && <p className="text-red-500 text-xs -my-2">{errors.email.message}</p>}
            {/* password */}
            <div className="relative">
              <input {...register("password")} type={isHidden1 ? "password" : "text"} placeholder="Password" className="w-full h-9 md:h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400 placeholder:text-sm text-sm md:placeholder:text-lg md:text-lg" />
              <button type="button" onClick={() => setIsHidden1(!isHidden1)} className="hover:cursor-pointer">
                <img src={isHidden1 ? hide.src : visible.src} className=" w-4 md:w-6 absolute right-4 top-[10px]" />
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs -my-2">{errors.password.message}</p>}
            {/* checkbox */}
            <div className="mt-1 flex items-center gap-2 md:gap-3 mb-5">
              <input {...register("checkbox")} type="checkbox" className="w-5 h-5" />
              <label className="text-xs -my-2">I agree to the <span className="underline text-sky-600 hover:cursor-pointer">Terms & Conditions</span></label>
            </div>
            {errors.checkbox && <p className="text-red-500 text-xs -mt-5">{errors.checkbox.message}</p>}
            <button className="w-full h-9 md:h-11 rounded-md text-white bg-sky-600 mb-3 cursor-pointer text-sm md:text-lg">Create account</button>
          </form>
          <div className="flex justify-evenly items-center mb-3">
            <hr className=" flex-grow border-sky-400" />
            <h1 className="text-xs text-sky-400 mx-4">Or register with</h1>
            <hr className=" flex-grow border-sky-400" />
          </div>
          <button onClick={handleGoogleSignIn} className="w-full h-9 md:h-11 rounded-md text-white border-sky-600 border-[1px] hover:cursor-pointer">
            <div className="flex items-center justify-center gap-2 w-full h-full">
              <img src={google.src} className="size-4 md:size-5 tracking-tight md:tracking-normal" />
              <span className="text-sm md:text-base text-sky-600">Continue with Google</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
