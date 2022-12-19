import Head from 'next/head';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { CatalogDataModelExtension } from '../lib/catalog-types';

type LayoutProps = {
  children: React.ReactNode;
  extension?: CatalogDataModelExtension;
};

export default function Layout(props: LayoutProps) {
  const { children, extension } = props;

  return (
    <>
      <Head>
        <title>
          {extension == undefined
            ? 'PACT Online Catalog'
            : `PACT Catalog - ${extension.description}`}
        </title>
      </Head>
      <header className="pact-color py-8 px-32">
        <h1 className="text-white">
          {extension == undefined
            ? 'WBCSD | PACT Online Catalog'
            : `${extension.description}`}
        </h1>
      </header>
      <main className='px-32 pb-32'>{children}</main>
    </>
  );
}
