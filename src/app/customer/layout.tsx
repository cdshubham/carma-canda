"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  FaUser,
  FaUsers,
  FaHome,
  FaTruck,
  FaDoorOpen,
  FaLock,
} from "react-icons/fa";
import { signOut } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import { ShoppingCart, ShoppingCartIcon } from "lucide-react";
import UserSidebar from "@/components/Usersidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="bg-slate-50 flex flex-col h-screen max-h-screen overflow-hidden">
      <div className="flex flex-1">

        <UserSidebar />
        <main className="max-h-screen  flex-grow p-6 overflow-y-auto  ">
          <SessionProvider>{children}</SessionProvider>
        </main>


      </div>
    </div>
  );
}
