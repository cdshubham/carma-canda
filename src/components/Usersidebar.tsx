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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";


const UserSidebar = () => {
    const pathname = usePathname();
    return (
        <div>
            <aside className="w-full h-full max-h-screen md:w-64 bg-text-white text-black flex  p-4 md:p-6 shadow-lg md:static  bottom-0 left-0 right-0 gap-4 hidden md:flex-col md:flex justify-between overflow-y-hidden">
                <div className="hidden md:flex mb-4">
                    <Image
                        src="/images/carma.jpg"
                        alt="Company"
                        width={40}
                        height={40}
                        className="rounded-full object-cover ring-2 ring-white/10 hover:ring-white/20 transition-all duration-200"
                    />
                </div>
                <nav className="flex flex-col w-full gap-3">
                    <Link href="/customer" passHref>
                        <Button
                            variant="ghost"
                            className={`w-full justify-start rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all duration-200 text-black ${pathname === "/customer"
                                ? "bg-white  shadow-md"
                                : " hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            <FaHome size={20} />
                            <span className="font-medium">Home</span>
                        </Button>
                    </Link>
                    <Link href="/customer/set-details" passHref>
                        <Button
                            variant="ghost"
                            className={`w-full justify-start rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all duration-200 text-black ${pathname === "/customer/set-details"
                                ? "bg-white  shadow-md"
                                : "hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            <FaUser size={20} />
                            <span className="font-medium">Customer Details</span>
                        </Button>
                    </Link>
                    <Link href="/customer/set-kids-detail" passHref>
                        <Button
                            variant="ghost"
                            className={`w-full justify-start rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all duration-200 text-black ${pathname === "/customer/set-kids-detail"
                                ? "bg-white  shadow-md"
                                : "hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            <FaUsers size={20} />
                            <span className="font-medium">Family Details</span>
                        </Button>
                    </Link>
                    <Link href="/customer/tracking" passHref>
                        <Button
                            variant="ghost"
                            className={`w-full justify-start rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all duration-200 text-black ${pathname === "/customer/tracking"
                                ? "bg-white  shadow-md"
                                : "hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            <FaTruck size={20} />
                            <span className="font-medium">Order Tracking</span>
                        </Button>
                    </Link>
                    <Link href="/customer/showorders" passHref>
                        <Button
                            variant="ghost"
                            className={`w-full justify-start rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all duration-200 text-black ${pathname === "/customer/showorders"
                                ? "bg-white  shadow-md"
                                : "hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            <ShoppingCartIcon size={20} />
                            <span className="font-medium">Your Orders</span>
                        </Button>
                    </Link>
                    <Link href="/customer/setpassword" passHref>
                        <Button
                            variant="ghost"
                            className={`w-full justify-start rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all duration-200 text-black ${pathname === "/customer/setpassword"
                                ? "bg-white  shadow-md"
                                : "hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            <FaLock size={20} />
                            <span className="font-medium">Set Password</span>
                        </Button>
                    </Link>
                </nav>
                <div className="mt-auto">

                    <Button
                        variant="ghost"
                        className="w-                    full justify-start rounded-xl px-4 py-2.5 flex items-center gap-2 text-black hover:bg-white/10 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                        onClick={() => signOut({ callbackUrl: "/", redirect: true })}
                    >
                        <FaDoorOpen size={20} />
                        <span className="font-medium">Sign Out</span>
                    </Button>
                </div>
            </aside>

            <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
                <div className="w-full">
                    <nav className="bg-white text-black flex justify-between p-2 border-t border-gray-200 shadow-lg">
                        <Link href="/customer" passHref>
                            <Button
                                variant="ghost"
                                className={`w-14 flex flex-col items-center rounded-xl px-2 py-2 transition-all duration-200 ${pathname === "/customer"
                                    ? "bg-white text-black shadow-md"
                                    : "text-black hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                                    }`}
                            >
                                <FaHome size={20} />
                                <span className="text-[10px] font-medium mt-0.5">Home</span>
                            </Button>
                        </Link>
                        <Link href="/customer/set-details" passHref>
                            <Button
                                variant="ghost"
                                className={`w-14 flex flex-col items-center rounded-xl px-2 py-2 transition-all duration-200 ${pathname === "/customer/set-details"
                                    ? "bg-white text-black shadow-md"
                                    : "text-black hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                                    }`}
                            >
                                <FaUser size={20} />
                                <span className="text-[10px] font-medium mt-0.5">Profile</span>
                            </Button>
                        </Link>
                        <Link href="/customer/set-kids-detail" passHref>
                            <Button
                                variant="ghost"
                                className={`w-14 flex flex-col items-center rounded-xl px-2 py-2 transition-all duration-200 ${pathname === "/customer/set-kids-detail"
                                    ? "bg-white text-black shadow-md"
                                    : "text-black hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                                    }`}
                            >
                                <FaUsers size={20} />
                                <span className="text-[10px] font-medium mt-0.5">Kids</span>
                            </Button>
                        </Link>
                        <Link href="/customer/tracking" passHref>
                            <Button
                                variant="ghost"
                                className={`w-14 flex flex-col items-center rounded-xl px-2 py-2 transition-all duration-200 ${pathname === "/customer/tracking"
                                    ? "bg-white text-black shadow-md"
                                    : "text-black hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                                    }`}
                            >
                                <FaTruck size={20} />
                                <span className="text-[10px] font-medium mt-0.5">Track</span>
                            </Button>
                        </Link>
                        <Link href="/customer/showorders" passHref>
                            <Button
                                variant="ghost"
                                className={`w-14 flex flex-col items-center rounded-xl px-2 py-2 transition-all duration-200 ${pathname === "/customer/showorders"
                                    ? "bg-white text-black shadow-md"
                                    : "text-black hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                                    }`}
                            >
                                <ShoppingCart size={20} />
                                <span className="text-[10px] font-medium mt-0.5">Orders</span>
                            </Button>
                        </Link>
                        <Link href="/customer/setpassword" passHref>
                            <Button
                                variant="ghost"
                                className={`w-14 flex flex-col items-center rounded-xl px-2 py-2 transition-all duration-200 ${pathname === "/customer/setpassword"
                                    ? "bg-white text-black shadow-md"
                                    : "text-black hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
                                    }`}
                            >
                                <FaLock size={20} />
                                <span className="text-[10px] font-medium mt-0.5">Pass</span>
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            className="w-14 flex flex-col items-center rounded-xl px-2 py-2 text-black hover:bg-white/10 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                            onClick={async () => await signOut({ redirectTo: "/" })}
                        >
                            <FaDoorOpen size={20} />
                            <span className="text-[10px] font-medium mt-0.5">Exit</span>
                        </Button>
                    </nav>
                </div>
            </div></div>

    )
}

export default UserSidebar;
