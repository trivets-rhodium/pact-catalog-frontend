import {
  CatalogDataModelExtension,
  DataModelExtensionId,
} from '../../../../lib/catalog-types';
import {
  getAllDataModelExtensionIds,
  getExtension,
} from '../../../../lib/data-model-extensions';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../../../components/layout';
import TabsLayout from '../../../../components/tabs-layout';
import readme from '../../../../components/extension-tabs/readme-tab';
import explore from '../../../../components/extension-tabs/explore-tab';
import usage from '../../../../components/extension-tabs/usage-tab';
import version from '../../../../components/extension-tabs/versions-tab';
import { getConformingSolutions } from '../../../../lib/solutions';

export const getStaticPaths: GetStaticPaths<
  DataModelExtensionId
> = async () => {
  const paths = await getAllDataModelExtensionIds();

  return {
    paths,
    fallback: false,
  };
};

type PageProps = {
  extension: CatalogDataModelExtension;
};

export const getStaticProps: GetStaticProps<
  PageProps,
  DataModelExtensionId
> = async ({ params }) => {
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

const tabs = [readme, explore, usage, version];

export default function Extension(props: PageProps) {
  const { extension } = props;

  return (
    <Layout extension={extension}>
      <TabsLayout tabs={tabs} extension={extension}></TabsLayout>
    </Layout>
  );
}
