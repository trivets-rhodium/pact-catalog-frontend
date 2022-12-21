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
  extension?: CatalogDataModelExtension;
  solution?: ConformingSolution;
};

export default function Layout(props: LayoutProps) {
  const { children, extension, solution } = props;

  let title =
    extension || solution
      ? `PACT | ${
          (extension && extension.description) || (solution && solution.name)
        }`
      : 'PACT Online Catalog';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Navbar />
      <main className="py-20 px-32">{children}</main>
    </>
  );
}
