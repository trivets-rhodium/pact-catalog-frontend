import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../components/layout';
import TabsLayout from '../../components/tabs-layout';
import { ConformingSolution, SolutionId } from '../../lib/catalog-types';
import { getAllSolutionsIds, getSolution } from '../../lib/solutions';
import readme from '../../components/solution-tabs/readme-tab';
import conformance from '../../components/solution-tabs/conformance-tab';
import usage from '../../components/solution-tabs/usage-tab';

type Id = {
  id: SolutionId;
};

export const getStaticPaths: GetStaticPaths<Id> = async () => {
  const paths = await getAllSolutionsIds();

  return {
    paths,
    fallback: false,
  };
};

type PageProps = {
  solution: ConformingSolution;
};

export const getStaticProps: GetStaticProps<PageProps, Id> = async ({
  params,
}) => {
  if (!params) {
    throw Promise.reject(new Error('No params'));
  }

  const solution = await getSolution(params.id);
  return {
    props: {
      solution,
    },
  };
};

const tabs = [readme, conformance, usage];

export default function Solution(props: PageProps) {
  const { solution } = props;

  return (
    <Layout solution={solution}>
      <TabsLayout tabs={tabs} solution={solution}></TabsLayout>
    </Layout>
  );
}
