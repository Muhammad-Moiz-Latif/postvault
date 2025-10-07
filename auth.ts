// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        const data = {
          username: user.name,
          email: user.email,
          password: account?.providerAccountId,
          image: user.image,
        };
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
          data
        );
        return true;
      } catch (err) {
        console.error("API user sync failed:", err);
        return true; // allow login even if API call fails
      }
    },
  },
});

// app/api/auth/[...nextauth]/route.ts
export { handlers as GET, handlers as POST } from "@/auth";