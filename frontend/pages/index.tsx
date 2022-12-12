import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { getAllExtensionsData } from '../lib/data-model-extensions';
import { GetStaticProps } from 'next';
import { IDataModelExtension } from '../lib/catalog-types';

type PageProps = {
  allExtensionsData: IDataModelExtension[];
};

export default function Home(req: PageProps) {
  let allExtensionsData = req.allExtensionsData;

  console.log(allExtensionsData);
  return (
    <>
      <Head>
        <title>PACT Online Catalog</title>
      </Head>
      <section>
        <ul>
          {allExtensionsData.map(
            ({ author, name, version, description, catalog_info }) => (
              <li key={name}>
                <p>{description}</p>
                <p>Publisher: {author}</p>
                {/* <p>Version: {version}</p> */}
                {/* <p>Description: {description}</p> */}
                <p>Status: {catalog_info.status}</p>
              </li>
            )
          )}
        </ul>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const allExtensionsData = await getAllExtensionsData();
  return {
    props: {
      allExtensionsData,
    },
  };
};
