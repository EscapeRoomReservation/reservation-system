import NextAuth, { AuthOptions, Session, User } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import EmailProvider from 'next-auth/providers/email';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request', // (e.g. a page telling the user to check their email for a magic link)
  },
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      // Send properties to the client, like an access_token from a provider.
      session.user.id = user.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
