import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { getAllExtensions } from '../lib/data-model-extensions';
import { GetStaticProps } from 'next';
import { CatalogDataModelExtension } from '../lib/catalog-types';
import Layout from '../components/layout';

type PageProps = {
    allExtensionsData: CatalogDataModelExtension[];
};

export default function Home(props: PageProps) {
    console.log(props);
    return (
        <Layout>
            <Head>
                <title>PACT Online Catalog</title>
            </Head>
            <section className='bg-white px-14 py-8'>
                <h1 className='text-xl font-bold'>PACKAGES</h1>
                <ul className='flex'>
                    {props.allExtensionsData.map(
                        ({ author, name, version, description, catalog_info }) => (
                            <li key={name} className={styles.card}>
                                <Link href={`/extensions/${name}/${version}`}>{description}</Link>
                                {/* <p className='font-bold'>{description}</p> */}
                                <div className='text-gray-500'>
                                    <p>Publisher: {author}</p>
                                    {/* <p>Version: {version}</p> */}
                                    {/* <p>Description: {description}</p> */}
                                    <p>Status: {catalog_info.status}</p>
                                </div>
                            </li>
                        )
                    )}
                </ul>
            </section>
            </Layout>
            );
}

            export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const allExtensionsData = await getAllExtensions();
                return {
                    props: {
                    allExtensionsData
                },
  };
};
