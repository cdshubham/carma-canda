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
import { ShoppingCart, ShoppingCartIcon, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

const UserSidebar = () => {
    const pathname = usePathname();

    const SidebarContent = () => (
        <div className="flex flex-col h-full w-full relative gap-5">
            <div className="relative h-20 my-6">
                <Image
                    src="/images/carma2.jpg"
                    alt="Company"
                    fill
                    className="object-cover ring-2 ring-white/10 hover:ring-white/20 transition-all duration-200 px-2"
                    priority
                />
            </div>

            <div className="flex flex-col min-h-[calc(100%-124px)] gap-4">
                <nav className="flex flex-col w-full gap-2 pb-16 gap-4">
                    <Link href="/customer" className="w-full" passHref>
                        <Button
                            variant="ghost"
                            className={`flex items-center justify-start gap-2 w-full px-4 py-2.5 !rounded-cardradius transition-all duration-200 ${pathname === "/customer"
                                ? "btnbg hover:btnbg animated-background text-black shadow-md"
                                : "hover:btnbg hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            <FaHome size={20} className="shrink-0" />
                            <span className="font-medium whitespace-nowrap">Home</span>
                        </Button>
                    </Link>
                    <Link href="/customer/set-details" className="w-full" passHref>
                        <Button
                            variant="ghost"
                            className={`flex items-center justify-start gap-2 w-full px-4 py-2.5 !rounded-cardradius transition-all duration-200 ${pathname === "/customer/set-details"
                                ? "btnbg hover:btnbg animated-background text-black shadow-md"
                                : "hover:btnbg hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            <FaUser size={20} className="shrink-0" />
                            <span className="font-medium whitespace-nowrap">Customer Details</span>
                        </Button>
                    </Link>
                    <Link href="/customer/set-kids-detail" className="w-full" passHref>
                        <Button
                            variant="ghost"
                            className={`flex items-center justify-start gap-2 w-full px-4 py-2.5 !rounded-cardradius transition-all duration-200 ${pathname === "/customer/set-kids-detail"
                                ? "btnbg hover:btnbg animated-background text-black shadow-md"
                                : "hover:btnbg hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            <FaUsers size={20} className="shrink-0" />
                            <span className="font-medium whitespace-nowrap">Family Details</span>
                        </Button>
                    </Link>
                    <Link href="/customer/tracking" className="w-full" passHref>
                        <Button
                            variant="ghost"
                            className={`flex items-center justify-start gap-2 w-full px-4 py-2.5 !rounded-cardradius transition-all duration-200 ${pathname === "/customer/tracking"
                                ? "btnbg hover:btnbg animated-background text-black shadow-md"
                                : "hover:btnbg hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            <FaTruck size={20} className="shrink-0" />
                            <span className="font-medium whitespace-nowrap">Order Tracking</span>
                        </Button>
                    </Link>
                    <Link href="/customer/showorders" className="w-full" passHref>
                        <Button
                            variant="ghost"
                            className={`flex items-center justify-start gap-2 w-full px-4 py-2.5 !rounded-cardradius transition-all duration-200 ${pathname === "/customer/showorders"
                                ? "btnbg hover:btnbg animated-background text-black shadow-md"
                                : "hover:btnbg hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            <ShoppingCartIcon size={20} className="shrink-0" />
                            <span className="font-medium whitespace-nowrap">Your Orders</span>
                        </Button>
                    </Link>
                    <Link href="/customer/setpassword" className="w-full" passHref>
                        <Button
                            variant="ghost"
                            className={`flex items-center justify-start gap-2 w-full px-4 py-2.5 !rounded-cardradius transition-all duration-200 ${pathname === "/customer/setpassword"
                                ? "btnbg hover:btnbg animated-background text-black shadow-md"
                                : "hover:btnbg hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            <FaLock size={20} className="shrink-0" />
                            <span className="font-medium whitespace-nowrap">Set Password</span>
                        </Button>
                    </Link>
                </nav>

                <div className="mt-auto w-full items-center justify-center">
                    <Button
                        variant="ghost"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 !rounded-cardradius text-black hover:bg-white/10 hover:shadow-md hover:scale-[1.02] transition-all duration-200 "
                        onClick={() => signOut({ callbackUrl: "/", redirect: true })}
                    >
                        <FaDoorOpen size={20} className="shrink-0" />
                        <span className="font-medium">Sign Out</span>
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white">
            {/* Mobile Sheet Trigger */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-white !rounded-cardradius">
                            <Menu className="h-4 w-4 " />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] p-6 bg-white">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:w-[300px] h-full flex-col p-6">
                <SidebarContent />
            </aside>
        </div>
    );
};

export default UserSidebar;
