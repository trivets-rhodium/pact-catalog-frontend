import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import style from '../styles/Home.module.css';
import {
  getAllExtensions,
  getLatestExtensionsSorted,
} from '../lib/data-model-extensions';
import { GetStaticProps } from 'next';
import {
  CatalogDataModelExtension,
  ConformingSolution,
} from '../lib/catalog-types';
import Layout from '../components/layout';
import Navbar from '../components/navbar';
import { title } from 'process';
import { getAllSolutions, getConformingSolutions } from '../lib/solutions';

type IndexLayoutProps = {
  title: string;
  children: React.ReactNode;
};
function IndexLayout(props: IndexLayoutProps) {
  const { title, children } = props;
  return (
    <section className="background py-8 rounded-sm">
      <h2 className="title px-4">{title}</h2>
      <ul className="grid grid-cols-3">{children}</ul>
    </section>
  );
}

type PageProps = {
  latestExtensionsData: CatalogDataModelExtension[];
  conformingSolutions: ConformingSolution[];
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const latestExtensionsData = await getLatestExtensionsSorted();
  const conformingSolutions = await getAllSolutions();
  return {
    props: {
      latestExtensionsData,
      conformingSolutions,
    },
  };
};

export default function Home(props: PageProps) {
  const { latestExtensionsData, conformingSolutions } = props;
  return (
    <Layout>
      <Head>
        <title>PACT Online Catalog</title>
      </Head>
      <IndexLayout title={'Data Model Catalog'}>
        {latestExtensionsData.map(
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
      </IndexLayout>
      <IndexLayout title={'Conforming Solutions'}>
        {conformingSolutions.map(({ id, name, extensions, providerName }) => (
          <Link href={'#'} key={id}>
            <li className={`${style.card} flex flex-col justify-between`}>
              <div>
                <p className="text-xl font-bold">{name}</p>
                <p>{providerName}</p>
              </div>
              <div>
                <ul>
                  {extensions.slice(0,2).map((extension) => {
                    return (
                      <li>
                        {extension.id} {extension.version}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          </Link>
        ))}
      </IndexLayout>
    </Layout>
  );
}
