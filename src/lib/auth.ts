import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null; // maybe I'll implement a profile system too
    };
  }
}

if (!process.env.MONGODB_URI) {
  throw new Error("Please check your environment variable."); // if the env ain't present
}

const URI = process.env.MONGODB_URI;

const client = new MongoClient(URI);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CID || "",
      clientSecret: process.env.GOOGLE_CS || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const db = (await clientPromise).db();
          const user = await db.collection("users").findOne({
            email: credentials.email,
          });
          if (!user) {
            return null; // User not found in db
          }
          const isPassWordValid = await bcrypt.compare(
            credentials.password,
            user.password
          ); //using bcruppt to compare passwords
          // now id password is valid, we'll return the user object for the session
          if (!isPassWordValid) {
            return null; // Password is invalid
          }

          return {
            id: user._id.toString(),
            name: user.name || null,
            email: user.email || null,
            image: user.image || null, // only if user has a profile image, thats for future use
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null; // Return null if any error occurs
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string; // Ensure id is a string
      }
      return session;
    },
  },
};
