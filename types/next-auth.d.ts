// types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      token?: string
      refreshToken?: string
      role?: string
    } & DefaultSession["user"]
  }

  interface User {
    id?: string
    token?: string
    refreshToken?: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    accessToken?: string
    refreshToken?: string
    role?: string
  }
}
