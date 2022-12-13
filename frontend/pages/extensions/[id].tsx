import Head from "next/head";
import { CatalogDataModelExtension, Documentation } from '../../lib/catalog-types';
import { getAllDMEIds, getExtension, getAllExtensions } from '../../lib/data-model-extensions';
import { GetStaticProps, GetStaticPaths } from 'next'

type PageProps = {
  extension: CatalogDataModelExtension;
  documentation: Documentation;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const [extension, readmeHtml] = await getExtension(params?.id as string);
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
  return (
    <>
      <Head>
        <title>{props.extension.description}</title>
      </Head>
      <section className='bg-white px-14 py-8'>
        <h1 className='text-xl font-bold'>{props.extension.description}</h1>
        <div dangerouslySetInnerHTML={{ __html: props.documentation }} />
      </section>
    </>
  );
}
