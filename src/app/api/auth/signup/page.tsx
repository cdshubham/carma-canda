import { Metadata } from "next";
import RegisterForm from "./RegisterForm";
import { redirect } from "next/navigation";
import { getSessionDetail } from "@/utils/SessionHandler";

export const metadata: Metadata = {
  title: "SignIn",
  description: "Create an account.",
};

export default async function RegisterPage() {
  const session = await getSessionDetail();

  if (session?.user) redirect("/");

  return (
    <section className="w-full flex items-center justify-center">
      <RegisterForm />
    </section>
  );
}
