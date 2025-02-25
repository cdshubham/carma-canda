import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Welcome
        </h1>
        <p className="text-center text-gray-600">
          Please login or create a new account to continue
        </p>
        <div className="flex flex-col space-y-4">
          <Button asChild>
            <Link href="/api/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/api/auth/signup">SignUp</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

// ngrok http 3000
