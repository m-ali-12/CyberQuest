// lib/auth.ts  — NextAuth v4 (stable)
import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const MAX_SESSIONS = 3;
const BAN_DURATION_MINUTES = 40;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;

        // Check ban
        if (user.isBanned && user.banUntil) {
          if (new Date() < user.banUntil) {
            const minutesLeft = Math.ceil((user.banUntil.getTime() - Date.now()) / 60000);
            throw new Error(`BANNED:${minutesLeft}`);
          } else {
            await prisma.user.update({ where: { id: user.id }, data: { isBanned: false, banUntil: null } });
          }
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Count active sessions
        const activeSessions = await prisma.loginSession.count({ where: { userId: user.id, isActive: true } });
        if (activeSessions >= MAX_SESSIONS) {
          const banCount = user.banCount + 1;
          const banMins = BAN_DURATION_MINUTES * Math.pow(2, Math.min(banCount - 1, 4));
          const banUntil = new Date(Date.now() + banMins * 60 * 1000);
          await prisma.user.update({ where: { id: user.id }, data: { isBanned: true, banUntil, banCount } });
          throw new Error(`BANNED:${banMins}`);
        }

        return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role, plan: user.plan } as any;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = (user as any).role; token.plan = (user as any).plan; }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).plan = token.plan;
      }
      return session;
    },
    async signIn({ user }) {
      if (!user?.id) return true;
      try {
        await prisma.loginSession.create({ data: { userId: user.id, sessionId: `${user.id}-${Date.now()}`, isActive: true } });
        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date(), loginCount: { increment: 1 } } });
      } catch {}
      return true;
    },
  },
  pages: { signIn: '/login', error: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};

// Drop-in replacement for next-auth v5 auth()
export function auth() {
  return getServerSession(authOptions);
}
