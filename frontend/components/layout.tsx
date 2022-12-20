import Head from 'next/head';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import { CatalogDataModelExtension } from '../lib/catalog-types';
import Navbar from './navbar';

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
      <Navbar />
      <main className="py-20 px-32">{children}</main>
    </>
  );
}
