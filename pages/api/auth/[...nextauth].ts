import NextAuth, { AuthOptions, Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import { dbUsers } from "@/database";

// 1. Define una interfaz que extienda la interfaz de `Session`.
interface ExtendedSession extends Session {
  accessToken?: string;
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: "Custom Login",
      credentials: {
        email: {
          label: "Correo:",
          type: "email",
          placeholder: "correo@example.com",
        },
        password: {
          label: "Contraseña:",
          type: "password",
          placeholder: "Contraseña",
        },
      },
      async authorize(credentials) {
        // return { name: 'Juan', correo: 'juan@google.com', role: 'admin' };

        return await dbUsers.checkUserEmailPassword(
          credentials!.email,
          credentials!.password
        );
      },
    }),

    // ...add more providers here
    GithubProvider({
      clientId: process.env.ID_GITHUB!,
      clientSecret: process.env.SECRET_GITHUB!,
    }),
  ],

  //custom pages
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  // Session
  session: {
    maxAge: 2592000,
    strategy: "jwt",
    updateAge: 86400,
  },

  //Callbacks
  callbacks: {
    async jwt({ account, token, user }) {
      //   console.log({ account, token, user });
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case "oauth":
            token.user = await dbUsers.oAUthToDbUser(
              user?.email || "",
              user?.name || ""
            );
            break;
          case "credentials":
            token.user = user;
            break;
        }
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: ExtendedSession;
      token: JWT;
      user: AdapterUser;
    } & {
      newSession: any;
      trigger: "update";
    }) {
      //   console.log({ session, token, user });
      session.accessToken = token.accessToken as any;
      session.user = token.user as any;
      return session;
    },
  },
};
export default NextAuth(authOptions);
