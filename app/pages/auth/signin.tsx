import { BuiltInProviderType } from 'next-auth/providers';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import Layout from '../../components/layout';
import { Router, useRouter } from 'next/router';
import { redirect } from 'next/dist/server/api-utils';

type SignInProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
};

// const home = 'http://localhost:3000/pact-catalog';

export default function SignIn({
  providers,
}: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>) {
  const router = useRouter();
  const github = Object.values(providers)[0];

  return (
    <>
      <Layout>
        <section className="mx-40 my-28 px-28 py-8 bg-white rounded-md flex flex-col justify-between text-center h-40">
          <h3>PACT Online Catalog</h3>
          <button
            onClick={() => {
              console.log(
                'sign in on click',
                github.id,
                router.query.callbackUrl
              );
              signIn(github.id, {
                callbackUrl: router.query.callbackUrl as string,
              });
              console.log('on click done successfully!');
            }}
            className="primary-button"
          >
            Log in with {github.name}{' '}
          </button>
        </section>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
