'use client';

import UserNav from "@/components/userNav";
import { setUserPostAsync } from "@/features/users/userPostSlice";
import { setPostAsync } from "@/features/posts/PostsSlice";
import { RootState } from "@/state/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/NavBarSkeleton";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const userData = useSelector((state: RootState) => state.UserInfo.list);
  const dispatch = useDispatch();
  const [SessionProvider, setSessionProvider] = useState<any>(null);

  useEffect(() => {
    async function loadSessionProvider() {
      const module = await import("next-auth/react");
      setSessionProvider(() => module.SessionProvider);
    }
    loadSessionProvider();
  }, []);

  useEffect(() => {
    //@ts-ignore
    dispatch(setUserPostAsync({ email: userData.email }));
    //@ts-ignore
    dispatch(setPostAsync());
  }, []);

  if (!SessionProvider) return <Skeleton />; // Wait until module loads

  return (
    <SessionProvider>
      {userData.email ? <UserNav /> : <Skeleton />}
      {children}
    </SessionProvider>
  );
}
