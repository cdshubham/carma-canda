"use client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { RiMailLine, RiLockLine } from "react-icons/ri";

import type { LoginCredentials } from "@types/auth.types";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = (data: LoginCredentials) => {
    console.log("Register Data:", data);
  };

  return (
    <section className="w-3/4 mx-auto flex flex-col gap-8">
      <div className="title">
        <h1 className="text-gray-800 text-4xl font-bold">Sign Up</h1>
        <p className="w-3/4 mx-auto text-gray-400">
          Please enter your details to Sign Up
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="relative">
          <RiMailLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <RiLockLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          Login
        </button>
      </form>

      <p className="text-center text-gray-500">
        Dont have an account?{" "}
        <Link href="/auth/signup" className="text-blue-600 font-bold">
          SignIn
        </Link>
      </p>
    </section>
  );
}
