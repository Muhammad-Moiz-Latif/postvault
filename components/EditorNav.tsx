"use client";

import { signOut } from "next-auth/react";
import { Playfair_Display, DM_Sans } from "next/font/google";
import noimage from "../assets/picture.png";
import bell from "../assets/bell.png";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState, store } from "@/state/store";
import { persistStore } from "redux-persist";
import { UserLogout } from "@/features/users/userInfoSlice";
import Link from "next/link";
import axios from "axios";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "900", "800", "700"],
});

const dm_sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "900", "800", "700"],
});

let persistor = persistStore(store);

export default function EditorNav({
  onPublish,
  Loading,
}: {
  onPublish?: () => void;
  Loading: boolean;
}) {
  const Data = useSelector((state: RootState) => state.UserInfo.list);
  const [drop, setDrop] = useState(false);
  async function handleClick() {
    try {
      const response = await axios.post(
        "/api/auth/logout",
        {},
        { withCredentials: true },
      );
      if (response) {
        {
          store.dispatch(UserLogout());
          persistor.purge();
          signOut({ callbackUrl: "/" });
        }
      }
    } catch (error) {}
  }

  return (
    <>
      <div
        className={`flex fixed w-full justify-between items-center border-b border-b-sky-100 px-10 py-2 bg-sky-50/40 font-medium tracking-tight text-[17px] ${dm_sans.className} z-10`}
      >
        <div className="flex gap-10 justify-center items-center ">
          <Link
            href="/home"
            className={`flex items-center ${playfair.className} font-semibold text-2xl`}
          >
            PostVault
          </Link>
        </div>
        <div>
          <ul className="flex gap-10 items-center">
            <button
              className="hover:cursor-pointer tracking-tighter text-sm bg-sky-800 text-white px-6 py-2 rounded-md"
              onClick={onPublish}
            >
              {Loading ? "Publishing" : "Publish"}
            </button>
            <img src={bell.src} className="size-5 hover:cursor-pointer" />
            <div className="flex flex-col relative">
              <img
                src={Data.image || noimage.src}
                className={`size-8 hover:cursor-pointer rounded-full ${drop ? "scale-90" : ""} object-cover border-[1px] border-sky-100`}
                onClick={() => setDrop(!drop)}
              />
              <div
                className={`w-40 p-2 h-60 absolute bg-sky-50 border-[1px] border-sky-100 flex flex-col items-start rounded-md -right-9 top-9 ${drop ? "visible" : "hidden"}`}
              >
                <Link href="/profile">Profile</Link>
                <button
                  onClick={handleClick}
                  className="hover:cursor-pointer text-[16px] tracking-tighter"
                >
                  Sign Out
                </button>

                <p className="text-xs tracking-tighter text-zinc-600">
                  {Data.email}
                </p>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
}
