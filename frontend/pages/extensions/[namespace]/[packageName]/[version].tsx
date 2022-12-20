import {
  CatalogDataModelExtension,
  ConformingSolution,
  DataModelExtensionId,
  Endorsers,
} from '../../../../lib/catalog-types';
import {
  getAllDataModelExtensionIds,
  getExtension,
} from '../../../../lib/data-model-extensions';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../../../components/layout';
import TabsLayout from '../../../../components/tabs-layout';
import readme from '../../../../components/tabs/readme-tab';
import explore from '../../../../components/tabs/explore-tab';
import usage from '../../../../components/tabs/usage-tab';
import version from '../../../../components/tabs/version-tab';
import { getEndorsers } from '../../../../lib/users';
import { getConformingSolutions } from '../../../../lib/solutions';

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
  const solutions = await getConformingSolutions(extension);
  return {
    props: {
      extension,
    },
  };
};

export const getStaticPaths: GetStaticPaths<
  DataModelExtensionId
> = async () => {
  const paths = await getAllDataModelExtensionIds();

  return {
    paths,
    fallback: false,
  };
};

const tabs = [readme, explore, usage, version];

export default function Extension(props: PageProps) {
  const { extension } = props;

  return (
    <Layout extension={extension}>
      <TabsLayout
        tabs={tabs}
        extension={extension}
      ></TabsLayout>
    </Layout>
  );
}
