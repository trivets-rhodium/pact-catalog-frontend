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
  endorsers: Endorsers;
  solutions: ConformingSolution[];
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
  const solutions = await getConformingSolutions(extension);
  return {
    props: {
      extension,
      endorsers,
      solutions,
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
  const { extension, endorsers, solutions } = props;
  console.log('endorsers:', endorsers);

  return (
    <Layout extension={extension}>
      <TabsLayout
        tabs={tabs}
        extension={extension}
        endorsers={endorsers}
        solutions={solutions}
      ></TabsLayout>
    </Layout>
  );
}
