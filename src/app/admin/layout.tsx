"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { MdOutlineShoppingCart } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaDoorOpen } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Image from "next/image";
import AdminSidebar from "@/components/Adminsidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const wordAfterAdmin = pathname?.split("/admin/")[1];
  console.log("😍😍", wordAfterAdmin);
  const [activeTab, setActiveTab] = useState(wordAfterAdmin);

  return (
    <div className="flex h-screen  flex-col-reverse md:flex-row">
     <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 bg-white rounded-lg overflow-auto">
        {children}
      </main>
    </div>
  );
}
