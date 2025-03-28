"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  RiUserLine,
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
import Link from "next/link";
import { toast } from "@pheralb/toast";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import Image from "next/image";
interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();
  const router = useRouter();
  const { fetchData, loading } = useFetch(`/api/users/signup`, {
    method: "POST",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (Formdata: RegisterFormInputs) => {
    const fetchPromise = fetchData(
      Formdata as unknown as Record<string, unknown>
    );

    toast.loading({
      text: "Loading...",
      options: {
        promise: fetchPromise,
        success: "Registration Successful! 🎉",
        error: "Failed to Register ❌",
        autoDismiss: true,
        onSuccess: () => {
          console.log("Success callback executed");
          setTimeout(() => router.push("/api/auth/login"), 500);
        },
        onError: () => {
          console.log("Error callback executed");
        },
      },
    });
  };

  return (
    <div className=" flex items-center justify-center px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full p-6 rounded-lg  sm:p-8">
        <div className="relative w-full h-[120px]">
          <Image
            src="/images/carma.jpg"
            alt="Company"
            fill
            style={{ objectFit: "cover" }}
            className="max-w-full"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <div className="relative">
              <RiUserLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Username"
                {...register("username", { required: "Username is required" })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 !rounded-inputradius focus:ring-black focus:border-black text-black"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm pl-10">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <RiMailLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 !rounded-inputradius focus:ring-black focus:border-black text-black"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm pl-10">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <div className="relative">
              <RiLockLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 !rounded-inputradius focus:ring-black focus:border-black text-black"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <RiEyeOffLine className="text-gray-400 text-xl" />
                ) : (
                  <RiEyeLine className="text-gray-400 text-xl" />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm pl-10">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 !rounded-inputradius hover:bg-gray-800 transition"
          >
            {loading ? "loading..." : "Sign Up"}
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-black">
          Already have an account?{" "}
          <Link href="/api/auth/login" className="text-black font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
