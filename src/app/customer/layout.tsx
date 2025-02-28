"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { FaUser, FaUsers, FaHome, FaTruck, FaDoorOpen } from "react-icons/fa";
import { signOut } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="bg-slate-50 flex flex-col min-h-screen">
      <div className="flex flex-1">
        <aside className="w-64 bg-black text-white p-4 hidden md:block fixed h-full">
          <h1 className="text-xl font-bold mb-6">Customer Portal</h1>
          <nav className="">
            <Link href="/customer" passHref>
              <Button
                variant="ghost"
                className={`w-full justify-start rounded-lg px-4 py-2 flex items-center gap-2  ${pathname === "/customer" ? "bg-white text-black shadow-lg " : "text-white hover:bg-slate-800 "}`}
              >
                <FaHome size={20} />
                Home
              </Button>
            </Link>
            <Link href="/customer/set-details" passHref>
              <Button
                variant="ghost"
                className={`w-full justify-start rounded-lg px-4 py-2 flex items-center gap-2  ${pathname === "/customer/set-details" ? "bg-white text-black shadow-lg " : "text-white hover:bg-slate-800 "}`}
              >
                <FaUser size={20} />
                Customer Details
              </Button>
            </Link>
            <Link href="/customer/set-kids-detail" passHref>
              <Button
                variant="ghost"
                className={`w-full justify-start rounded-lg px-4 py-2 flex items-center gap-2  ${pathname === "/customer/set-kids-detail" ? "bg-white text-black shadow-lg " : "text-white hover:bg-slate-800 "}`}
              >
                <FaUsers size={20} />
                Kids Details
              </Button>
            </Link>
            <Link href="/customer/tracking" passHref>
              <Button
                variant="ghost"
                className={`w-full justify-start rounded-lg px-4 py-2 flex items-center gap-2  ${pathname === "/customer/tracking" ? "bg-white text-black shadow-lg " : "text-white hover:bg-slate-800 "}`}
              >
                <FaTruck size={20} />
                Order Tracking
              </Button>
            </Link>
            <Button
              variant="ghost"
              className={`w-full justify-start rounded-lg px-4  flex items-center gap-2  ${pathname === "/customer/tracking" ? "bg-white text-black shadow-lg " : "text-white hover:bg-slate-800 "}`}
              onClick={() => signOut({ callbackUrl: "/", redirect: true })}
            >
              <FaDoorOpen size={20} />
              Sign Out
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto md:ml-64">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white flex p-3 md:hidden">
          <Link href="/customer" passHref className="flex-1">
            <Button
              variant="ghost"
              className={`w-full flex flex-col items-center rounded-lg px-4 py-2 ${
                pathname === "/customer"
                  ? "bg-white text-black shadow-lg"
                  : "text-white hover:bg-slate-800"
              }`}
            >
              <FaHome size={20} />
              Home
            </Button>
          </Link>
          <Link href="/customer/set-details" passHref className="flex-1">
            <Button
              variant="ghost"
              className={`w-full flex flex-col items-center rounded-lg px-4 py-2 ${
                pathname === "/customer/set-details"
                  ? "bg-white text-black shadow-lg"
                  : "text-white hover:bg-slate-800"
              }`}
            >
              <FaUser size={20} />
              Customer
            </Button>
          </Link>
          <Link href="/customer/set-kids-detail" passHref className="flex-1">
            <Button
              variant="ghost"
              className={`w-full flex flex-col items-center rounded-lg px-4 py-2 ${
                pathname === "/customer/set-kids-detail"
                  ? "bg-white text-black shadow-lg"
                  : "text-white hover:bg-slate-800"
              }`}
            >
              <FaUsers size={20} />
              Kids
            </Button>
          </Link>
          <Link href="/customer/tracking" passHref className="flex-1">
            <Button
              variant="ghost"
              className={`w-full flex flex-col items-center rounded-lg px-4 py-2 ${
                pathname === "/customer/tracking"
                  ? "bg-white text-black shadow-lg"
                  : "text-white hover:bg-slate-800"
              }`}
            >
              <FaTruck size={20} />
              Track
            </Button>
          </Link>
          <div className="flex-1">
            <Button
              variant="ghost"
              className="w-full flex flex-col items-center rounded-lg px-4 py-2 text-white hover:bg-slate-800"
              onClick={async () => await signOut({ redirectTo: "/" })}
            >
              <FaDoorOpen size={20} />
              Logout
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
