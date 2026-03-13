import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Role } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { compare } from "bcryptjs";
import { normalizeEmail } from "@/lib/account";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await db.user.findFirst({
          where: { email: normalizeEmail(credentials.email) },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      if (!token.role && token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.role = (token.role as Role | undefined) ?? "CUSTOMER";
      }

      return session;
    },
  },
  pages: {
    signIn: "/account",
  },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}
