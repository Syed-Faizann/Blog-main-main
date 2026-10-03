import NextAuth, { auth } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const { handlers, signIn, signOut } = NextAuth(authOptions)

export { handlers, signIn, signOut, auth }
