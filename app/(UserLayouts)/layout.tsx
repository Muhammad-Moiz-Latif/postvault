'use client';

import UserNav from "@/components/userNav";
import { SessionProvider } from "next-auth/react";



export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SessionProvider>
      <UserNav />
      {children}
    </SessionProvider>
  );
}
