import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen max-h-screen w-screen  text-black ">
      <div className="m-auto  rounded-md w-full h-full grid grid-cols-1 lg:grid-cols-2">
        <div className="relative w-full h-1/3 lg:h-full hidden lg:block bg-gray-200">
         
        </div>
        <div className="flex flex-col justify-center p-6 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
