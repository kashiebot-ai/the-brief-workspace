import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// For development, we'll use a simple username/password
// In production, you should use a proper user database
const AUTH_USERNAME = process.env.AUTH_USERNAME || 'admin';
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'password';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Simple check for development
        if (!credentials) {
          return null;
        }
        
        const { username, password } = credentials;
        
        if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
          // Return a user object
          return {
            id: '1',
            name: 'Kashie Admin',
            email: 'admin@example.com',
          };
        }
        
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };