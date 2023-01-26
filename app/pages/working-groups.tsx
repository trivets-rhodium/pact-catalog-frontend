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
    const { id, name, description } = workingGroup;
    return {
      id,
      href: `/working-groups/${id}`,
      title: name,
      subtitle: description,
    };
  });

  return (
    <Layout title="Working Groups">
      <LongCards title="Working Groups" longCards={groupLongCards} />
    </Layout>
  );
}
