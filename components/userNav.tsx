'use client'

import { signOut } from "next-auth/react";
import { Playfair_Display, DM_Sans } from "next/font/google";
import create from '../assets/edit.png';
import noimage from '../assets/picture.png';
import search from '../assets/search-interface-symbol.png';
import bell from '../assets/bell.png';
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";


const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '900', '800', '700']
});

const dm_sans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '900', '800', '700']
});

export default function UserNav() {
    const Data = useSelector((state: RootState) => state.setUserInfo.list);
    const [drop, setDrop] = useState(false);
    return (
        <>
            <div className={`flex fixed w-full justify-between items-center border-b border-b-sky-100 px-10 py-2 bg-sky-50/40 font-medium tracking-tight text-[17px] ${dm_sans.className} z-10`}>
                <div className="flex gap-10 justify-center items-center ">
                    <div className={`flex items-center ${playfair.className} font-semibold text-2xl`}>
                        PostVault
                    </div>
                    <div className="relative items-center justify-center flex">
                        <img src={search.src} className="size-5 absolute left-3" />
                        <input type="text" className="w-60  pl-10 border-sky-50 h-9 bg-sky-100 rounded-2xl  text-[16px]  outline-none placeholder:text-zinc-400 placeholder:text-[16px] placeholder:tracking-tighter placeholder:font-light" placeholder="Explore topics" />
                    </div>
                </div>
                <div>
                    <ul className="flex gap-10 items-center">
                        <li className="hover:cursor-pointer tracking-tighter text-[16px]">About Us</li>
                        <div className="flex gap-1 justify-center items-center hover:cursor-pointer">
                            <li className=" tracking-tighter text-[16px]">Create</li>
                            <img src={create.src} className="size-4" />
                        </div>
                        <img src={bell.src} className="size-5 hover:cursor-pointer" />
                        <div className="flex flex-col relative">
                            <img src={Data.image || noimage.src} className={`size-8 hover:cursor-pointer rounded-full ${drop ? "scale-90" : ""} object-cover border-[1px] border-sky-100`} onClick={() => setDrop(!drop)} />
                            <div className={`w-40 p-2 h-60 absolute bg-sky-50 border-[1px] border-sky-100 rounded-md -right-9 top-9 ${drop ? "visible" : "hidden"}`}>
                                <button onClick={() => signOut({ callbackUrl: "/" })} className="hover:cursor-pointer text-[16px] tracking-tighter">Sign Out</button>
                                <p className="text-xs tracking-tighter text-zinc-600">{Data.email}</p>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </>
    )
}