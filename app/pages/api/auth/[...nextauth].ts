import NextAuth, {
  Account,
  Awaitable,
  NextAuthOptions,
  Profile,
  Session,
} from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GithubProvider from 'next-auth/providers/github';
import { getServerSideProps } from '../../auth/signin';

export const authOptions = {
  providers: [
    GithubProvider({
      // TO DO: improve error handling, in case environment variables are not provided?
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      authorization: {
        url: 'https://github.com/login/oauth/authorize',
        params: {
          scope: 'repo',
        },
      },
    }),
  ],
  callbacks: {
    // TO DO: improve type safety, although these are heavily dependent on NextAuth?
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.user = profile;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: '/pact-catalog/auth/signin',
  },
};

export default NextAuth(authOptions);
