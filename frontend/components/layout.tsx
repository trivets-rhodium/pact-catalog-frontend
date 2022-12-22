import Head from 'next/head';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import {
  CatalogDataModelExtension,
  ConformingSolution,
} from '../lib/catalog-types';
import Navbar from './navbar';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps & {title: string}) {
  const { children } = props;

  const headTitle = props.title ? `PACT | ${props.title}` : 'PACT Online Catalog'

  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>
      <Navbar />
      <main className="py-20 px-32">{children}</main>
    </>
  );
}
