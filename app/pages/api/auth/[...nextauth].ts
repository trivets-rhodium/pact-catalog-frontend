import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { getServerSideProps } from '../../auth/signin';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      authorization: {
        url: 'https://github.com/login/oauth/authorize',
        params: { scope: 'repo' },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account) {
        console.log('account', account);
        token.accessToken = account.access_token;
        token.id = profile.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/pact-catalog/auth/signin',
  },
};

export default NextAuth(authOptions);
