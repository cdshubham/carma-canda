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
    "/api/auth/changepassword",
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>

      {!userId && (
        <div className="p-4 mb-4 bg-yellow-100 text-yellow-800 rounded">
          You must be logged in to change your password.
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      {data && (
        <div className="p-4 mb-4 bg-green-100 text-green-800 rounded">
          Password changed successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            className={`w-full px-3 py-2 border rounded-md ${errors.currentPassword ? "border-red-500" : "border-gray-300"}`}
            disabled={loading || !userId}
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="mb-4">
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
            className={`w-full px-3 py-2 border rounded-md ${errors.newPassword ? "border-red-500" : "border-gray-300"}`}
            disabled={loading || !userId}
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="mb-6">
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
            className={`w-full px-3 py-2 border rounded-md ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
            disabled={loading || !userId}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800   focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
          disabled={loading || !userId}
        >
          {loading ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
