"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { MdOutlineShoppingCart } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaDoorOpen } from "react-icons/fa";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const wordAfterAdmin = pathname?.split("/admin/")[1];
  console.log("😍😍", wordAfterAdmin);
  const [activeTab, setActiveTab] = useState(wordAfterAdmin);

  return (
    <div className="flex h-screen bg-gray-100 flex-col-reverse md:flex-row">
      <aside className="w-full md:w-64 bg-gray-900 text-white flex md:flex-col flex-row p-4 md:p-6 shadow-lg md:static fixed bottom-0 left-0 right-0">
        <nav className="flex md:flex-col flex-row w-full justify-around md:justify-start gap-1">
          <Link
            href="/admin/orders"
            className={`flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "orders"
                ? "bg-white text-black"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <MdOutlineShoppingCart size={20} />
            <span className="text-xs md:text-base">Orders</span>
          </Link>
          <Link
            href="/admin/customers"
            className={`flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "customers"
                ? "bg-white text-black"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("customers")}
          >
            <BsPeople size={20} />
            <span className="text-xs md:text-base">Customers</span>
          </Link>
          <Button
            variant="ghost"
            className={`flex flex-col md:flex-row justify-start  md:items-start gap-1 md:gap-2 px-4 py-2 rounded-lg ${pathname === "/customer/tracking" ? "bg-white text-black shadow-lg " : "text-white hover:bg-slate-800 "}`}
            onClick={() => signOut({ redirectTo: "/" })}
          >
            <FaDoorOpen size={20} />
            Sign Out
          </Button>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-6 bg-white shadow-md rounded-lg overflow-auto">
        {children}
      </main>
    </div>
  );
}
