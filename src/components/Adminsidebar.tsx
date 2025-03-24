import Link from "next/link";
import { MdOutlineShoppingCart } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaDoorOpen } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";


const AdminSidebar = () => {
    const pathname = usePathname();
    const wordAfterAdmin = pathname?.split("/admin/")[1];
    const [activeTab, setActiveTab] = useState(wordAfterAdmin);
    return <aside className="w-full md:w-64  flex md:flex-col flex-row p-4 md:p-6  md:static fixed bottom-0 left-0 right-0 gap-4">
        <div className="hidden md:flex mb-4 h-[100px]">
            <Image
                src="/images/carma.jpg"
                alt="Company"
                width={200}
                height={80}
                className=" object-cover ring-2 ring-white/10 hover:ring-white/20 transition-all duration-200"
            />
        </div>

        <nav className="flex md:hidden flex-row w-full justify-between">
            <Link
                href="/admin/orders"
                className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-200 ${activeTab === "orders"
                    ? "bg-white text-black shadow-md"
                    : "hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                    }`}
                onClick={() => setActiveTab("orders")}
            >
                <MdOutlineShoppingCart size={22} />
                <span className="text-xs font-medium">Orders</span>
            </Link>
            <Link
                href="/admin/customers"
                className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-200 ${activeTab === "customers"
                    ? "bg-white text-black shadow-md"
                    : "hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                    }`}
                onClick={() => setActiveTab("customers")}
            >
                <BsPeople size={22} />
                <span className="text-xs font-medium">Customers</span>
            </Link>
            <Button
                variant="ghost"
                className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-200 ${pathname === "/customer/tracking text-black"
                    ? "bg-white  shadow-md"
                    : " hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                    }`}
                onClick={() => signOut({ redirectTo: "/" })}
            >
                <FaDoorOpen size={22} />
                <span className="text-xs font-medium">Sign Out</span>
            </Button>
        </nav>

        <div className="hidden md:flex md:flex-col h-full gap-3">
            <nav className="flex flex-col w-full gap-2">
                <Link
                    href="/admin/orders"
                    className={`flex flex-row items-center gap-3 px-4 py-2.5 rounded-buttonradius transition-all duration-200 ${activeTab === "orders"
                        ? "btnbg hover:btnbg animated-background  text-black shadow-md"
                        : "hover:btnbg hover:shadow-md hover:scale-[1.02]"
                        }`}
                    onClick={() => setActiveTab("orders")}
                >
                    <MdOutlineShoppingCart size={20} />
                    <span className="font-medium">Orders</span>
                </Link>
                <Link
                    href="/admin/customers"
                    className={`flex flex-row items-center gap-3 px-4 py-2.5 rounded-buttonradius transition-all duration-200 ${activeTab === "customers"
                        ? "btnbg   hover:text-black animated-background text-black shadow-md"
                        : " text-black hover:shadow-md hover:scale-[1.02]"
                        }`}
                    onClick={() => setActiveTab("customers")}
                >
                    <BsPeople size={20} />
                    <span className="font-medium">Customers</span>
                </Link>
            </nav>

            <div className="mt-auto">
                <Button
                    variant="ghost"
                    className="flex flex-row items-center w-full gap-3 px-4 py-2.5 rounded-buttonradius text-black hover:bg-white/10 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                    onClick={() => signOut({ redirectTo: "/" })}
                >
                    <FaDoorOpen size={20} />
                    <span className="font-medium">Sign Out</span>
                </Button>
            </div>
        </div>
    </aside>;
};

export default AdminSidebar;



