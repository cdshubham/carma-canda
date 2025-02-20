import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-blue-400 text-black">
      <div className="m-auto bg-slate-50 rounded-md w-3/5 h-3/4 grid lg:grid-cols-2">
        <div className="relative">
          <Image
            src="/images/carma.jpg"
            alt="carma"
            fill
            style={{ objectFit: "cover" }}
          ></Image>
        </div>
        <div className="right flex flex-col justify-evenly ">
          <div className="text-center ">{children}</div>
        </div>
      </div>
    </div>
  );
}
