import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        hash: { label: "Hash", type: "text" },
        expires: { label: "Expires", type: "text" }
      },
      async authorize(credentials) {
        // 1. Verify standard credentials
        if (
          credentials?.email !== process.env.ADMIN_EMAIL ||
          credentials?.password !== process.env.ADMIN_PASSWORD
        ) {
          return null;
        }

        // 2. Check if the OTP window has expired
        if (Date.now() > Number(credentials?.expires)) {
          throw new Error("OTP has expired.");
        }

        // 3. Reconstruct the hash using the user's inputted OTP
        const secret = process.env.NEXTAUTH_SECRET || "fallback";
        const dataString = `${credentials?.otp}.${credentials?.expires}.${secret}`;
        const expectedHash = crypto.createHash("sha256").update(dataString).digest("hex");

        // 4. Compare hashes. If they match, the user entered the correct emailed code.
        if (credentials?.hash === expectedHash) {
          return { id: "1", name: "Altun", email: process.env.ADMIN_EMAIL };
        }

        throw new Error("Invalid authorization code.");
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // Enforces exact 1-hour session limit
    updateAge: 15 * 60, // Sliding session: extends the hour if active for 15+ mins
  },
  jwt: {
    maxAge: 60 * 60, 
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };