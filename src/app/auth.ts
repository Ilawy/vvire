import NextAuth, { NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema/users";
import { objectToAuthDataMap, AuthDataValidator } from "@telegram-auth/server";
import { createUserOrUpdate } from "./actions";

const telegramProvider = CredentialsProvider({
  id: "telegram",
  name: "Telegram Login",

  credentials: {},
  async authorize(credentials, req) {
    console.log("XX");

    const validator = new AuthDataValidator({
      botToken: process.env.BOT_TOKEN,
    });
    const query = Object.fromEntries(new URL(req.url!).searchParams);
    const data = objectToAuthDataMap(query);
    const user = await validator.validate(data);
    if (user.id && user.first_name) {
      const returned = {
        id: user.id.toString(),
        email: user.id.toString(),
        name: [user.first_name, user.last_name || ""].join(" "),
        image: user.photo_url,
      };

      try {
        const result = await createUserOrUpdate(user);
        console.log("!!!", result);
      } catch {
        console.log("Something went wrong while creating the user.");
      }
      return returned;
    }
    return null;
  },
});

export const nextAuthOptions: NextAuthConfig = {
  providers: [telegramProvider],
  callbacks: {
    async session({ session, user, token }) {
      session.user.id = session.user.email;
      return session;
    },
    redirect({ url, baseUrl }) {
      return url;
    },
  },
  pages: {
    // signIn: "/auth/signin",
    // error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    authenticatorsTable: authenticators,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
};

export const { handlers, signIn, signOut, auth } = NextAuth(nextAuthOptions);
