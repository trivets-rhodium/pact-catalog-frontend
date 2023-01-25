import { GetStaticProps } from 'next';
import { LongCards } from '../components/cards';
import Layout from '../components/layout';
import { WorkingGroup } from '../lib/catalog-types';
import { getAllWorkingGroups } from '../lib/working-groups';

type PageProps = { allWorkingGroups: WorkingGroup[] };

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const allWorkingGroups = await getAllWorkingGroups();
  return {
    props: {
      allWorkingGroups,
    },
  };
};

export default function WorkingGroups(props: PageProps) {
  const { allWorkingGroups } = props;

  const groupLongCards = allWorkingGroups.map((workingGroup) => {
    return {
      href: '#', // TO DO: Get static props
      title: workingGroup.name,
      subtitle: workingGroup.description,
    };
  });

  return (
    <Layout title="Working Groups">
      <LongCards title="Working Groups" longCards={groupLongCards} />
    </Layout>
  );
}
