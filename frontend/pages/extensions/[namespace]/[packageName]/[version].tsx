import Head from "next/head";
import { CatalogDataModelExtension, Documentation, DataModelExtensionId, ExtensionDetails } from '../../../../lib/catalog-types';
import { getAllDataModelExtensionIds, getExtension, getAllExtensions, getExtensionDetails } from '../../../../lib/data-model-extensions';
import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link';
import Layout from "../../../../components/layout";
import Tabs from "../../../../components/tabs"

type PageProps = {
  extension: CatalogDataModelExtension,
  extensionDetails: ExtensionDetails,

};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id: DataModelExtensionId = {
    namespace: params?.namespace as string,
    packageName: params?.packageName as string,
    version: params?.version as string
  }

  const extension = await getExtension(id);
  const extensionDetails = await getExtensionDetails(id);

  return {
    props: {
      extension,
      extensionDetails,
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
  const { extension, extensionDetails } = props;

  return (
    <Layout extension={props.extension} >
      <Tabs tabs={extensionDetails} />

    </Layout>
  );
}
