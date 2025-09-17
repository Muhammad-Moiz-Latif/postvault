"use client";

import UserNav from "@/components/userNav";
import { setUserPostAsync } from "@/state/features/userPostSlice";
import { setPostAsync } from "@/state/features/PostsSlice";
import { RootState } from "@/state/store";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/NavBarSkeleton";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = useSelector((state: RootState) => state.setUserInfo.list);
  const dispatch = useDispatch();
  useEffect(() => {
    //@ts-ignore
    dispatch(setUserPostAsync({ email: userData.email }));
    //@ts-ignore
    dispatch(setPostAsync());
  }, []);
  return (
    <SessionProvider>
      {userData.email ? <UserNav /> : <Skeleton />}
      {children}
    </SessionProvider>
  );
}
