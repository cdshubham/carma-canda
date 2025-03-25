"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const PasswordPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            // TODO: Implement API call to change admin password
            const response = await fetch("/api/admin/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to change password");
            }

            toast.success("Password changed successfully!");
            router.push("/admin/dashboard");
        } catch (error) {
            toast.error("Failed to change password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full w-full flex justify-center items-center"><div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-cardradius shadow-md">
            <h1 className="text-2xl font-bold mb-6">Change Admin Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                        Current Password
                    </label>
                    <Input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                        New Password
                    </label>
                    <Input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                        Confirm New Password
                    </label>
                    <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    className="!rounded-buttonradius w-full"
                >
                    {loading ? "Changing Password..." : "Change Password"}
                </Button>
            </form>
        </div></div>
        
    );
};

export default PasswordPage;

