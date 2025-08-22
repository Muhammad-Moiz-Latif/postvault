import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import axios from "axios"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const data = {
          username: user.name,
          email: user.email,
          password: account?.providerAccountId,
          image: user.image
        }
        const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, data);
        console.log(result.data);
        return true
      } catch (err) {
        console.error("API user sync failed:", err)
        return true // let login succeed even if API call fails
      }
    },
  },
})
