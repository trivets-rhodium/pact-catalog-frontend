import Head from "next/head";
import { CatalogDataModelExtension, Documentation, DataModelExtensionId } from '../../../../lib/catalog-types';
import { getAllDataModelExtensionIds, getExtension, getAllExtensions } from '../../../../lib/data-model-extensions';
import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link';
import Layout from "../../../../components/layout";

type PageProps = {
  extension: CatalogDataModelExtension;
  readmeHtml: Documentation;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id: DataModelExtensionId = {
    namespace: params?.namespace as string,
    packageName: params?.packageName as string,
    version: params?.version as string
  }

  const [extension, readmeHtml] = await getExtension(id);
  return {
    props: {
      extension,
      readmeHtml
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllDataModelExtensionIds();

  return {
    paths,
    fallback: false,
  };
};

export default function Extension(props: PageProps) {
  const {extension, readmeHtml} = props;

  return (
    <Layout extension = {props.extension} >
      <Head>
        <title>{extension.description}</title>
      </Head>
      <section className='bg-white px-14 py-8'>
        <div dangerouslySetInnerHTML={{ __html: props.readmeHtml }} />
        <Link href="/">← Back to home</Link>
      </section>
    </Layout>
  );
}
