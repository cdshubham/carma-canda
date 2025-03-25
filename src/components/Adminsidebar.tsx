import Link from "next/link";
import { MdOutlineShoppingCart } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaDoorOpen } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

const AdminSidebar = () => {
    const pathname = usePathname();
    const wordAfterAdmin = pathname?.split("/admin/")[1];
    const [activeTab, setActiveTab] = useState(wordAfterAdmin);

    const SidebarContent = () => (
        <div className="flex flex-col h-full gap-4">
            <div className="mb-4 h-[100px]">
                <Image
                    src="/images/carma.jpg"
                    alt="Company"
                    width={200}
                    height={80}
                    className="object-cover ring-2 ring-white/10 hover:ring-white/20 transition-all duration-200"
                />
            </div>

            <div className="flex flex-col h-full gap-3">
                <nav className="flex flex-col w-full gap-2">
                    <Link
                        href="/admin/orders"
                        className={`flex flex-row items-center gap-3 px-4 py-2.5 rounded-buttonradius transition-all duration-200 ${activeTab === "orders"
                            ? "btnbg hover:btnbg animated-background text-black shadow-md"
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
                            ? "btnbg hover:btnbg animated-background text-black shadow-md"
                            : "hover:btnbg hover:shadow-md hover:scale-[1.02]"
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
        </div>
    );

    return (
        <>
            {/* Mobile Sheet Trigger */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <div className="w-full flex justify-start items-center"><Button variant="outline" size="icon" className="bg-white">
                            <Menu className="h-4 w-4" />
                        </Button></div>
                        
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-6 bg-white">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:w-64 flex-col p-6 gap-4 bg-white ">
                <SidebarContent />
            </aside>
        </>
    );
};

export default AdminSidebar;



