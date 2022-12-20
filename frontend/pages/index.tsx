import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import style from '../styles/Home.module.css';
import { getAllExtensions, getLatestExtensions } from '../lib/data-model-extensions';
import { GetStaticProps } from 'next';
import { CatalogDataModelExtension } from '../lib/catalog-types';
import Layout from '../components/layout';
import Navbar from '../components/navbar';

type PageProps = {
  allExtensionsData: CatalogDataModelExtension[];
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const allExtensionsData = await getLatestExtensions();
  return {
    props: {
      allExtensionsData,
    },
  };
};

export default function Home(props: PageProps) {
  console.log(props);
  return (
    <Layout>
      <Head>
        <title>PACT Online Catalog</title>
      </Head>
      <section className="background py-8 rounded-sm">
        <h2 className="title px-4">PACKAGES</h2>
        <ul className="grid grid-cols-3">
          {props.allExtensionsData.map(
            ({ author, name, version, description, catalog_info }) => (
              <Link
                href={`/extensions/${name}/${version}`}
                key={`${name}/${version}`}
              >
                <li className={`${style.card} flex flex-col justify-between`}>
                  <div>
                    <p className="text-xl font-bold">{description}</p>
                    <p>{version}</p>
                  </div>
                  <ul>
                    <li>Publisher: {author.name}</li>
                    <li>Status: {catalog_info.status}</li>
                  </ul>
                </li>
              </Link>
            )
          )}
        </ul>
      </section>
    </Layout>
  );
}
