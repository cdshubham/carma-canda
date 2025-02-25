import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-blue-400 text-black">
      <div className="m-auto bg-slate-50 rounded-md w-full h-full grid grid-cols-1 lg:grid-cols-2">
        <div className="relative w-full h-1/3 lg:h-full hidden lg:block">
          <Image
            src="/images/carma.jpg"
            alt="Company"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex flex-col justify-center p-6 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
