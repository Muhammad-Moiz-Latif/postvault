'use client';

import UserNav from "@/components/userNav";
import { SessionProvider } from "next-auth/react";
import { store } from "@/state/store";
import { Provider } from "react-redux";



export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <UserNav />
        {children}
      </SessionProvider>
    </Provider>
  );
}
