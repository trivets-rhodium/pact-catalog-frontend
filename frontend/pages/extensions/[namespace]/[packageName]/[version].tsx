import Head from 'next/head';
import {
  CatalogDataModelExtension,
  DataModelExtensionId,
  DetailTab,
} from '../../../../lib/catalog-types';
import {
  getAllDataModelExtensionIds,
  getExtension,
} from '../../../../lib/data-model-extensions';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../../../components/layout';
import Tabs from '../../../../components/tabs';

type PageProps = {
  extension: CatalogDataModelExtension;
};

export const getStaticProps: GetStaticProps<PageProps, DataModelExtensionId> = async ({ params }) => {
  if (!params) {
    throw Promise.reject(new Error('No params'));
  }

  const extension = await getExtension(params);
  return {
    props: {
      extension,
    },
  };
};

export const getStaticPaths: GetStaticPaths<DataModelExtensionId> = async () => {
  const paths = await getAllDataModelExtensionIds();

  return {
    paths,
    fallback: false,
  };
};

// as an idea, we could have a type for the tab render function
type TabRenderFunction = (e: CatalogDataModelExtension) => JSX.Element;
type Tab = {
  tab_id: string,
  title: string,
  render: TabRenderFunction,
}

const versionTab: TabRenderFunction = (e) => {
  return (
    <div>
      <h1 className="text-xl font-bold">{e.description}</h1>
      <p>{e.version}</p>
    </div>
  );
}


export default function Extension(props: PageProps) {
  const { extension, extensionDetails } = props;

  return (
    <Layout extension={props.extension} >
      <Tabs tabs={extensionDetails} />
    </Layout>
  );
}
