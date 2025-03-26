import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("All fields are required.");
        }

        const response = await fetch(
          `${process.env.NEXTAUTH_URL}/api/user/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );

        const user = await response.json();

        if (!response.ok) {
          throw new Error(user.error || "Login failed");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Keep it as a frontend login page
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async signIn({ user, account }) {
      console.log("user", user);
      return account?.provider === "credentials";
    },
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl;

      if (pathname === "/") {
        if (auth?.user?.role === "admin") {
          return NextResponse.redirect(new URL("/admin/orders", request.url));
        }
        if (auth?.user?.role === "user") {
          return NextResponse.redirect(new URL("/customer", request.url));
        }
      }

      if (pathname.includes("/admin") && auth?.user?.role !== "admin") {
        return NextResponse.json({ error: "Access Denied" }, { status: 403 });
      }

      if (pathname.includes("/customer") && auth?.user?.role !== "user") {
        return NextResponse.json({ error: "Access Denied" }, { status: 403 });
      }

      return true;
    },
  },
});
