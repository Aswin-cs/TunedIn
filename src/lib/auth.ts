import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDb } from "@/config/connectDb";
import User from "@/models/user.model";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER_GOOGLE_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER_GOOGLE_CLIENT_SECRET",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "tunedin_ultra_secure_studio_master_secret_2026",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDb();
          const email = user.email?.toLowerCase().trim();
          if (!email) return false;

          let existingUser = await User.findOne({ email });

          if (!existingUser) {
            // Retrieve chosen username saved by user on /login
            let chosenUsername = "";
            try {
              const cookieStore = await cookies();
              chosenUsername = cookieStore.get("tunedin_pending_username")?.value?.trim() || "";
            } catch (cErr) {
              // Ignore cookie read failures in server contexts
            }

            if (!chosenUsername) {
              chosenUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_");
            }

            // Check if this username already exists
            const isTaken = await User.findOne({
              username: { $regex: new RegExp(`^${chosenUsername}$`, "i") },
            });

            if (isTaken) {
              chosenUsername = `${chosenUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
            }

            await User.create({
              email,
              username: chosenUsername,
              name: user.name || "",
              avatar: user.image || "",
              createadAt: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
          return true;
        } catch (err) {
          console.error("Error syncing Google user with MongoDB:", err);
          return true;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (token?.email) {
        try {
          await connectDb();
          const dbUser = await User.findOne({ email: token.email.toLowerCase() }).lean();
          if (dbUser) {
            token.username = dbUser.username;
            token.userId = (dbUser as any)._id?.toString();
          }
        } catch (err) {
          console.error("Error attaching user to JWT:", err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).username = token.username || (session.user.email ? session.user.email.split("@")[0] : "studio_guest");
        (session.user as any).id = token.userId || token.sub;
      }
      return session;
    },
  },
};

export default authOptions;
