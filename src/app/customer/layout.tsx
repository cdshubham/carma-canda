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
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <div className="flex md:flex-row flex-col-reverse  flex-1 h-scren max-h-screen overflow-hidden">

        <UserSidebar />
        <main className=" h-full max-h-full overflow-y-auto  flex-grow p-6  mt-8 md:mt-0  ">
          <SessionProvider>{children}</SessionProvider>
        </main>


      </div>
    </div>
  );
}
