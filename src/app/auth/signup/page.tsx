import { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "SignIn",
  description: "Create an account.",
};

export default function RegisterPage() {
  return (
    <section className="w-full flex items-center justify-center">
      <RegisterForm />
    </section>
  );
}
