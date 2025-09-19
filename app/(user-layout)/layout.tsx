"use client";

import UserNav from "@/components/userNav";
import { setUserPostAsync } from "@/features/users/userPostSlice";
import { setPostAsync } from "@/features/posts/PostsSlice";
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
  const userData = useSelector((state: RootState) => state.UserInfo.list);
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
