import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login with account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
