import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../components/layout';
import { TabsLayout, Tab } from '../../components/tabs';
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

export default function Solution(props: PageProps) {
  const { solution } = props;
  // These are not passed as props, not only because they don't change from solution to solution,
  // but also because, since Tab<T> includes a function, they could not be serialized in a JSON.
  const tabs: Tab<ConformingSolution>[] = [readme, conformance, usage];

  return (
    <Layout title={solution.name}>
      <TabsLayout
        tabs={tabs}
        content={solution}
        title={solution.name}
      ></TabsLayout>
    </Layout>
  );
}
