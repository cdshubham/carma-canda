"use client";

import { useForm } from "react-hook-form";
import useFetch from "../../../hooks/useFetch";
import { useSession } from "next-auth/react";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const { data, loading, error, fetchData } = useFetch(
    `/api/auth/changepassword`,
    {
      method: "POST",
    }
  );

  const onSubmit = async (formData: FormData) => {
    if (formData.newPassword !== formData.confirmPassword) {
      return;
    }

    if (!userId) {
      console.error("User ID not found in session");
      return;
    }

    await fetchData({
      userId: userId,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    if (!error) {
      reset();
    }
  };

  return (
    <div className="w-full h-full flex items-center">
      <div className="min-w-[400px] max-w-[400px] mx-auto p-6 bg-white !rounded-cardradius shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Update your account password
          </p>
        </div>

        {!userId && (
          <div className="p-4 mb-4 bg-yellow-100 text-yellow-800 !rounded-cardradius border border-yellow-200">
            You must be logged in to change your password.
          </div>
        )}

        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-800 !rounded-cardradius border border-red-200">
            {error}
          </div>
        )}

        {data && (
          <div className="p-4 mb-4 bg-green-100 text-green-800 !rounded-cardradius border border-green-200">
            Password changed successfully!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              className={`w-full px-3 py-2 border !rounded-inputradius ${
                errors.currentPassword
                  ? "border-red-500 focus:ring-red-500/10"
                  : "border-gray-300 focus:border-black focus:ring-black/10"
              }`}
              disabled={loading || !userId}
              placeholder="Enter your current password"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className={`w-full px-3 py-2 border !rounded-inputradius ${
                errors.newPassword
                  ? "border-red-500 focus:ring-red-500/10"
                  : "border-gray-300 focus:border-black focus:ring-black/10"
              }`}
              disabled={loading || !userId}
              placeholder="Enter your new password"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
              className={`w-full px-3 py-2 border !rounded-inputradius ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500/10"
                  : "border-gray-300 focus:border-black focus:ring-black/10"
              }`}
              disabled={loading || !userId}
              placeholder="Confirm your new password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 !rounded-inputradius hover:bg-gray-800 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !userId}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Changing Password...
              </div>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
