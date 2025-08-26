"use client";


import { setUserInfo } from "@/state/features/userInfoSlice";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export default function Home() {
    const { data: session } = useSession();
    const dispatch = useDispatch();
    useEffect(() => {
        if (session?.user) {
            dispatch(setUserInfo({
                username: session.user.name,
                email: session.user.email,
                image: session.user.image
            }))
        }
    }, [session])

    return (
        <>
            <div className="py-16 px-10">
                <h1>This is the home page.</h1>
            </div>
        </>
    )
}