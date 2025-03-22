"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
import Link from "next/link";
import { toast } from "@pheralb/toast";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import Image from "next/image";
interface AuthFormInputs {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormInputs>();
  const router = useRouter();
  const { data: session } = useSession();
  console.log("🤔🤔", session);

  const { data, fetchData, loading } = useFetch("/api/users/login", {
    method: "POST",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (Formdata: AuthFormInputs) => {
    const fetchPromise = fetchData(Formdata);
    toast.loading({
      text: "Loading...",
      options: {
        promise: fetchPromise,
        success: "Logged In Successful! 🎉",
        error: "Failed to Login ❌",
        autoDismiss: true,
        onSuccess: () => {
          setTimeout(async () => {
            const updatedSession = await getSession();

            console.log("👍😂", updatedSession);

            if (updatedSession?.user?.role === "admin") {
              console.log("user is admin----------->");
              router.push("/admin/orders");
            } else {
              console.log("👍👍", updatedSession?.user);
              router.push("/customer");
            }
          }, 500);
        },
        onError: () => {
          console.log("Error callback executed");
        },
      },
    });
  };

  return (
    <div className="w-full h-full max-h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-white ">
      <div className="relative w-full h-[120px]">
        <Image
          src="/images/carma.jpg"
          alt="Company"
          fill
          style={{ objectFit: "cover" }}
          className="max-w-full"
        />
      </div>
      <div className="max-w-md w-full p-6 rounded-lg  sm:p-8">

        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Sign In
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className=" w-full">
            <div className="relative">
              <RiMailLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-black"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm pl-10">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <div className="relative">
              <RiLockLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-black text-sm sm:text-base"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <RiEyeOffLine className="text-gray-400 text-lg sm:text-xl" />
                ) : (
                  <RiEyeLine className="text-gray-400 text-lg sm:text-xl" />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs sm:text-sm pl-10">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg"
          >
            {loading ? "loading ..." : "Login"}
          </button>
        </form>
        <p className="text-xs sm:text-sm text-center mt-3 sm:mt-4 text-black">
          Don't have an account?{" "}
          <Link href="/api/auth/signup" className="text-black font-bold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
