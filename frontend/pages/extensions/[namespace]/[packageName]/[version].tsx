import {
  CatalogDataModelExtension,
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
// tabs is a Tab[] that is used in the Extension function. It is not a prop, as it only includes
// what is common to all detail pages.
import readme from '../../../../components/tabs/readme-tab';
import explore from '../../../../components/tabs/explore-tab';
import usage from '../../../../components/tabs/usage-tab';
import version from '../../../../components/tabs/version-tab';
import { getEndorsers } from '../../../../lib/users';

type PageProps = {
  extension: CatalogDataModelExtension;
  endorsers: Endorsers;
};

export const getStaticProps: GetStaticProps<
  PageProps,
  DataModelExtensionId
> = async ({ params }) => {
  if (!params) {
    throw Promise.reject(new Error('No params'));
  }

  const extension = await getExtension(params);
  const endorsers = await getEndorsers(extension);
  return {
    props: {
      extension,
      endorsers,
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
  const { extension, endorsers } = props;
  console.log('endorsers:', endorsers);

  return (
    <Layout extension={extension}>
        <TabsLayout tabs={tabs} extension={extension} endorsers={endorsers}></TabsLayout>
    </Layout>
  );
}
