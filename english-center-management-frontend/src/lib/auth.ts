import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LoginData, TokenResponse } from '../types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const loginData: LoginData = {
            email: credentials.email,
            password: credentials.password,
          };
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
          });

          if (!response.ok) {
            return null;
          }

          const result: TokenResponse = await response.json();

          // Get user info using the token
          const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${result.access_token}`,
              'Content-Type': 'application/json',
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            return {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role_name: userData.role_name,
              accessToken: result.access_token,
            };
          }

          // Fallback if user info fetch fails
          return {
            id: credentials.email,
            email: credentials.email,
            name: credentials.email,
            role_name: 'admin', // Default role
            accessToken: result.access_token,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
