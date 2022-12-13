import Head from "next/head";
import { CatalogDataModelExtension, Documentation } from '../../../lib/catalog-types';
import { getAllDMEIds, getExtension, getAllExtensions } from '../../../lib/data-model-extensions';
import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link';

type PageProps = {
  extension: CatalogDataModelExtension;
  readmeHtml: Documentation;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const extensionId = `${params?.author}/${params?.id}`
  const [extension, readmeHtml] = await getExtension(extensionId);
  return {
    props: {
      extension,
      readmeHtml
    },
  };
}
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllDMEIds();

  return {
    paths,
    fallback: false,
  };

};

export default function Extension(props: PageProps) {
  console.log(props)
  return (
    <>
      <Head>
        <title>{props.extension.description}</title>
      </Head>
      <section className='bg-white px-14 py-8'>
        <h1 className='text-xl font-bold'>{props.extension.description}</h1>
        <div dangerouslySetInnerHTML={{ __html: props.readmeHtml }} />
        <Link href="/">← Back to home</Link>
      </section>
    </>
  );
}
