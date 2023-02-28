import Head from 'next/head';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import {
  CatalogDataModelExtension,
  ConformingSolution,
} from '../lib/catalog-types';
import Navbar from './navbar';
import { Footer } from './footer';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout(props: LayoutProps) {
  const { children, title } = props;

  const headTitle = title ? `PACT | ${title}` : 'PACT Online Catalog';

  return (
    <div className="min-h-screen">
      <Head>
        <title>{headTitle}</title>
      </Head>
      <Navbar />
      <main className="pt-16 pb-16 px-32">{children}</main>
      <Footer />
    </div>
  );
}
