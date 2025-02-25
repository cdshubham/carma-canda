import { Metadata } from "next";
import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";
import { getSessionDetail } from "@/utils/SessionHandler";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login with account.",
};

export default async function LoginPage() {
  const session = await getSessionDetail();
  if (session?.user) redirect("/");

  return (
    <section className="w-full flex items-center justify-center">
      <SessionProvider>
        <LoginForm />
      </SessionProvider>
    </section>
  );
}
