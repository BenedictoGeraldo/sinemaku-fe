import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { axiosInstance } from "@/services/api";

type BackendAuthResponse = {
  access_token: string;
  user: {
    id: string | number;
    name: string;
    email: string;
  };
};
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        try {
          const { data } = await axiosInstance.post<BackendAuthResponse>(
            "/auth/login",
            {
              email: credentials.email,
              password: credentials.password,
            },
          );

          return {
            id: String(data.user.id),
            name: data.user.name,
            email: data.user.email,
            accessToken: data.access_token,
          };
        } catch {
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials" && user) {
        token.userId = user.id;
        token.accessToken = (user as { accessToken?: string }).accessToken;
      }

      if (account?.provider === "google") {
        try {
          const { data } = await axiosInstance.post<BackendAuthResponse>(
            "/auth/google-login",
            {
              email: token.email,
              name: token.name,
              image: token.picture,
            },
          );

          token.userId = String(data.user.id);
          token.accessToken = data.access_token;
        } catch {
          return token;
        }
      }

      return token;
    },

    async session({ session, token }) {
      (session.user as { id?: string }).id = token.userId as string | undefined;
      (session as { accessToken?: string }).accessToken = token.accessToken as
        | string
        | undefined;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
