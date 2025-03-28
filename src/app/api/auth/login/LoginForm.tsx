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
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Function to get updated session data
  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/auth/session`);
      if (!response.ok) throw new Error("Failed to fetch session");
      const session = await response.json();
      console.log("Updated Session:", session);
      return session;
    } catch (error) {
      console.error("Error fetching session:", error);
      return null;
    }
  };

  const onSubmit = async (formData: AuthFormInputs) => {
    setLoading(true);
    toast.loading({ text: "Logging in..." });

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (result?.error) {
      toast.error({ text: "Invalid email or password" });
    } else {
      toast.success({ text: "Login successful!" });

      setTimeout(async () => {
        const updatedSession = await fetchSession();
        console.log(updatedSession);

        if (updatedSession?.user?.role === "admin") {
          router.push("/admin/orders");
        } else if (updatedSession?.user?.role === "user") {
          router.push("/customer");
        } else {
          router.push("/");
        }
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full p-6 rounded-lg sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Sign In
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <div className="w-full">
            <div className="relative">
              <RiMailLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm pl-10">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="w-full">
            <div className="relative">
              <RiLockLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-black"
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-xs sm:text-sm text-center mt-3 sm:mt-4 text-black">
          {"Don't have an account?"}
          <Link href="/signup" className="text-black font-bold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
