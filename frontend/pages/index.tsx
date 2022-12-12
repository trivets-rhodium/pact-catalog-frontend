import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { getAllExtensionsData } from '../lib/data-model-extensions';
import { GetStaticProps } from 'next'

export default function Home({ allExtensionsData }: {
  allExtensionsData: {
    author: string,
    name: string,
    version: string,
    description: string,
    status: string
  }[]
}) {
  console.log(allExtensionsData);
  return (
    <>
      <Head>
        <title>PACT Online Catalog</title>
      </Head>
      <section>
        <ul>
        {allExtensionsData.map(({ author, name, version, description, status }) => (
            <li key={name}>
              <p>{description}</p>
              <p>Publisher: {author}</p>
              {/* <p>Version: {version}</p> */}
              {/* <p>Description: {description}</p> */}
              <p>Status: {status}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allExtensionsData = await getAllExtensionsData();
  return {
    props: {
      allExtensionsData,
    },
  };
}
