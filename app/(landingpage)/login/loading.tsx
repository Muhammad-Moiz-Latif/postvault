"use client"

import type React from "react"

import { useState } from "react"
import { Roboto } from "next/font/google"

const roboto = Roboto({
  weight: ["400", "700", "600", "500"],
  subsets: ["latin"],
})

export default function LoginSkeleton() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your form submission logic here
    console.log("Form submitted")
  }

  return (
    <div className="max-w-full h-screen flex justify-center items-center bg-sky-200 p-8">
      <div className="bg-white rounded-xl w-full h-full flex">
        {/* Left side - Image section */}
        <div className="w-1/2 rounded-xl relative m-3 bg-sky-50 flex flex-col items-center justify-center">
          <div className="w-full h-64 bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg mb-8 flex items-center justify-center">
            <div className="text-sky-400 text-6xl">📱</div>
          </div>
          <h1 className={`text-center ${roboto.className} text-2xl text-gray-700 px-8`}>
            Every story deserves a safe place — welcome to
          </h1>
          <div className="mt-4 text-sky-600 font-bold text-3xl">POSTVAULT</div>
        </div>

        {/* Right side - Form section */}
        <div className={`w-1/2 relative rounded-r-xl bg-white flex flex-col py-5 px-24 ${roboto.className}`}>
          <h1 className="text-[40px] font-medium">Create an account</h1>
          <h1 className="text-sm mt-2">
            Already have an account?
            <button className="text-sky-600 hover:cursor-pointer ml-1">Log in</button>
          </h1>

          <form className="flex flex-col gap-3 mt-10" onSubmit={handleSubmit}>
            <input
              className="w-full h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400"
              placeholder="Username"
              type="text"
            />

            <input
              className="w-full h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400"
              placeholder="Email"
              type="email"
            />

            <div className="relative">
              <input
                className="w-full h-11 rounded-md pl-4 focus:outline-sky-600 bg-sky-100 placeholder:text-gray-400"
                placeholder="Password"
                type={isPasswordVisible ? "text" : "password"}
              />
              <button
                className="hover:cursor-pointer absolute right-4 top-[10px]"
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <span className="text-gray-400 text-sm">{isPasswordVisible ? "🙈" : "👁️"}</span>
              </button>
            </div>

            <div className="mt-1 flex items-center gap-3 mb-5">
              <input type="checkbox" className="w-5 h-5" />
              <label className="text-xs">
                I agree to the <span className="underline text-sky-600 hover:cursor-pointer">Terms & Conditions</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-md text-white bg-sky-600 mb-3 cursor-pointer hover:bg-sky-700 transition-colors"
            >
              Create account
            </button>
          </form>

          <div className="flex justify-evenly items-center mb-3">
            <hr className="flex-grow border-sky-400" />
            <h1 className="text-xs text-sky-400 mx-4">Or register with</h1>
            <hr className="flex-grow border-sky-400" />
          </div>

          <button className="w-full h-11 rounded-md border-sky-600 border-[1px] hover:cursor-pointer hover:bg-sky-50 transition-colors">
            <div className="flex items-center justify-center gap-2 w-full h-full">
              <span className="text-lg">🔍</span>
              <span className="text-base text-sky-600">Continue with Google</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
