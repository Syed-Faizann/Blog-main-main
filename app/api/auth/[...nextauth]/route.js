import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // ✅ GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    // ✅ Credentials (email/password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error("Invalid email or password")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) throw new Error("Invalid email or password")

        return user
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      // ✅ Handle GitHub login linking with existing email
      if (account.provider === "github" && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })

        if (existingUser && existingUser.id !== user.id) {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {},
            create: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
          })
        }
      }
      return true
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.picture = user.image;
        token.name = user.name;
        token.email = user.email;
      }
      if (trigger === "update" && session) {
        if (session.image !== undefined) token.picture = session.image;
        if (session.name !== undefined) token.name = session.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        const userId = token.id || token.sub;
        session.user.id = userId;
        if (token.picture) session.user.image = token.picture;
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;

        // Fetch fresh image from DB to ensure instant consistency across re-renders
        if (userId) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: userId },
              select: { image: true, name: true },
            });
            if (dbUser) {
              if (dbUser.image) session.user.image = dbUser.image;
              if (dbUser.name) session.user.name = dbUser.name;
            }
          } catch (e) {
            // fallback gracefully
          }
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin", // optional custom page
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
