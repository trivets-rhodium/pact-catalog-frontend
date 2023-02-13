import { withAuth } from 'next-auth/middleware';

// export { default } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: `/auth/signin`,
  },
});

// Doesn't allow access to the api/form route, and therefore nothing at all happens: neither a call to the
// GitHub API, nor an errorn '/api/form', '/submit-extension'
export const config = { matcher: ['/faq'] };
