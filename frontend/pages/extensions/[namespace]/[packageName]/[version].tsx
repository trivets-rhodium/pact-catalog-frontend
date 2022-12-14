import Head from "next/head";
import { CatalogDataModelExtension, Documentation, DataModelExtensionId } from '../../../../lib/catalog-types';
import { getAllDataModelExtensionIds, getExtension, getAllExtensions } from '../../../../lib/data-model-extensions';
import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link';
import Layout from "../../../../components/layout";
import Tabs from "../../../../components/tabs"

type PageProps = {
  extension: CatalogDataModelExtension,
  readmeHtml: Documentation,
  tabNames: string[],

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
  const { extension, readmeHtml } = props;

  const tabNames = ['Read Me', 'Explore', 'Usage', 'Version']
  return (
    <Layout extension={props.extension} >
      <Head>
        <title>{extension.description}</title>
      </Head>
        <Tabs tabNames={tabNames}/>
        <div dangerouslySetInnerHTML={{ __html: props.readmeHtml }} />
    </Layout>
  );
}
