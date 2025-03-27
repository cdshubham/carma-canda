import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(
            "http://localhost:3000/api/users/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );

          if (!response.ok) {
            throw new Error("Invalid email or password");
          }

          const user = await response.json();

          if (!user || !user.id || !user.role) {
            throw new Error("Invalid user data returned from API");
          }

          console.log("Authenticated User:", user);

          return {
            id: user.id || user._id,
            role: user.role || "user",
            email: user.email,
          };
        } catch (error) {
          console.error("Error in authorize:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.id) {
        session.user = {
          id: token.id,
          role: token.role || "user",
          email: token.email,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/api/auth/login",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
