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
          <div className="hidden md:flex mb-2">
            <Image
              src="/images/carma.jpg"
              alt="Company"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>
          <nav className="flex flex-col h-full">
            <div className="flex-1">
              <Link href="/customer" passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start rounded-lg px-4 py-2 flex items-center gap-2 ${
                    pathname === "/customer"
                      ? "bg-white text-black shadow-lg"
                      : "text-white hover:bg-slate-800"
                  }`}
                >
                  <FaHome size={20} />
                  Home
                </Button>
              </Link>
              <Link href="/customer/set-details" passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start rounded-lg px-4 py-2 flex items-center gap-2 ${
                    pathname === "/customer/set-details"
                      ? "bg-white text-black shadow-lg"
                      : "text-white hover:bg-slate-800"
                  }`}
                >
                  <FaUser size={20} />
                  Customer Details
                </Button>
              </Link>
              <Link href="/customer/set-kids-detail" passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start rounded-lg px-4 py-2 flex items-center gap-2 ${
                    pathname === "/customer/set-kids-detail"
                      ? "bg-white text-black shadow-lg"
                      : "text-white hover:bg-slate-800"
                  }`}
                >
                  <FaUsers size={20} />
                  Family Details
                </Button>
              </Link>
              <Link href="/customer/tracking" passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start rounded-lg px-4 py-2 flex items-center gap-2 ${
                    pathname === "/customer/tracking"
                      ? "bg-white text-black shadow-lg"
                      : "text-white hover:bg-slate-800"
                  }`}
                >
                  <FaTruck size={20} />
                  Order Tracking
                </Button>
              </Link>
              <Link href="/customer/showorders" passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start rounded-lg px-4 py-2 flex items-center gap-2 ${
                    pathname === "/customer/showorders"
                      ? "bg-white text-black shadow-lg"
                      : "text-white hover:bg-slate-800"
                  }`}
                >
                  <ShoppingCartIcon size={20} />
                  Your Orders
                </Button>
              </Link>
              <Link href="/customer/setpassword" passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start rounded-lg px-4 py-2 flex items-center gap-2 ${
                    pathname === "/customer/setpassword"
                      ? "bg-white text-black shadow-lg"
                      : "text-white hover:bg-slate-800"
                  }`}
                >
                  <FaLock size={20} />
                  Set Password
                </Button>
              </Link>
            </div>
            <div className="mt-auto" style={{ marginBottom: "40px" }}>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-lg px-4 py-2 flex items-center gap-2 text-white hover:bg-slate-800"
                onClick={() => signOut({ callbackUrl: "/", redirect: true })}
              >
                <FaDoorOpen size={20} />
                Sign Out
              </Button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto md:ml-64">
          <SessionProvider>{children}</SessionProvider>
        </main>

        <div className="fixed bottom-0 left-0 right-0 md:hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <nav className="bg-slate-900 text-white flex p-3 min-w-max">
              <Link href="/customer" passHref>
                <Button
                  variant="ghost"
                  className={`min-w-24 flex flex-col items-center rounded-lg px-4 py-2 ${
                    pathname === "/customer"
                      ? "bg-white text-black shadow-lg"
                      : "text-white hover:bg-slate-800"
                  }`}
                >
                  <FaHome size={20} />
                  Home
                </Button>
              </Link>
              <Link href="/customer/set-details" passHref>
                <Button
                  variant="ghost"
                  className={`min-w-24 flex flex-col items-center rounded-lg px-4 py-2 ${
                    pathname === "/customer/set-details"
                      ? "bg-white text-black shadow-lg"
                      : "text-white hover:bg-slate-800"
                  }`}
                >
                  <FaUser size={20} />
                  Customer
                </Button>
              </Link>
              <Link href="/customer/set-kids-detail" passHref>
                <Button
                  variant="ghost"
                  className={`min-w-24 flex flex-col items-center rounded-lg px-4 py-2 ${
                    pathname === "/customer/set-kids-detail"
                      ? "bg-white text-black shadow-lg"
                      : "text-white hover:bg-slate-800"
                  }`}
                >
                  <FaUsers size={20} />
                  Kids
                </Button>
              </Link>
              <Link href="/customer/tracking" passHref>
                <Button
                  variant="ghost"
                  className={`min-w-24 flex flex-col items-center rounded-lg px-4 py-2 ${
                    pathname === "/customer/tracking"
                      ? "bg-white text-black shadow-lg"
                      : "text-white hover:bg-slate-800"
                  }`}
                >
                  <FaTruck size={20} />
                  Track
                </Button>
              </Link>
              <Link href="/customer/tracking" passHref>
                <Button
                  variant="ghost"
                  className={`min-w-24 flex flex-col items-center rounded-lg px-4 py-2 ${
                    pathname === "/customer/showorders"
                      ? "bg-white text-black shadow-lg"
                      : "text-white hover:bg-slate-800"
                  }`}
                >
                  <ShoppingCart size={20} />
                  Your orders
                </Button>
              </Link>
              <Link href="/customer/setpassword" passHref>
                <Button
                  variant="ghost"
                  className={`min-w-24 flex flex-col items-center rounded-lg px-4 py-2 ${
                    pathname === "/customer/setpassword"
                      ? "bg-white text-black shadow-lg"
                      : "text-white hover:bg-slate-800"
                  }`}
                >
                  <FaLock size={20} />
                  Password
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="min-w-24 flex flex-col items-center rounded-lg px-4 py-2 text-white hover:bg-slate-800"
                onClick={async () => await signOut({ redirectTo: "/" })}
              >
                <FaDoorOpen size={20} />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
