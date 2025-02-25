import NextAuth, { CredentialsSignin } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { connect } from "./db/connection";
import User from "./models/userModels";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new CredentialsSignin("All fields are required.");
        }
        await connect();

        const user = await User.findOne({ email });

        if (!user) {
          throw new CredentialsSignin("Invalid email or password");
        }

        const valid = await compare(password, user.password);

        if (!valid) {
          throw new CredentialsSignin("Invalid email or password");
        }

        const userData = {
          id: user._id,
          name: user.username,
          email: user.email,
          role: user.role,
        };
        return userData;
      },
    }),
  ],
  pages: {
    signIn: "/api/auth/login",
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
      if (account?.provider === "credentials") {
        return true;
      } else {
        return false;
      }
    },
    async authorized({ request, auth }) {
      if (
        request.nextUrl.pathname.includes("/admin") &&
        auth?.user.role !== "admin"
      ) {
        console.log("chal haatt");

        return false;
      }

      return true;
    },
  },
});
