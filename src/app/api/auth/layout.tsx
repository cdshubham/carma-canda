import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-screen text-black relative bg-gray-50">
      {/* Mobile background image */}
      <div className="absolute inset-0 w-full h-full lg:hidden">
        <Image src="/maincanada.jpg" alt="Carma" fill style={{ objectFit: "cover" }} />
        <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay for better contrast */}
      </div>

      <div className="m-auto h-screen w-full grid grid-cols-1 lg:grid-cols-[3fr_2fr] relative z-10">
        {/* Desktop image */}
        <div className="relative w-full h-1/3 lg:h-full hidden lg:block">
          <Image src="/maincanada.jpg" alt="Carma" fill style={{ objectFit: "cover" }} />
        </div>

        <div className="flex flex-col items-center justify-center  w-full min-h-screen lg:min-h-0">


          <div className="w-full max-w-md bg-white backdrop-blur-sm  shadow-lg  rounded-cardradius mx-auto p-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
