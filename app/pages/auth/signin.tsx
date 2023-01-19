import { BuiltInProviderType } from 'next-auth/providers';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import Layout from '../../components/layout';

type SignInProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
  callback: string;
};

export default function SignIn(props: SignInProps) {
  const { providers, callback } = props;
  const github = Object.values(providers)[0];
  console.log('callback', callback);
  return (
    <>
      <Layout>
        <section className="mx-40 my-28 px-28 py-8 bg-white rounded-md flex flex-col justify-between text-center h-40">
          <h3>PACT Online Catalog</h3>
          <button
            onClick={() => {
              signIn(github.id, { callbackUrl: callback });
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders();
  const callback = context.req.headers.referer;
  return {
    props: { providers, callback },
  };
}
