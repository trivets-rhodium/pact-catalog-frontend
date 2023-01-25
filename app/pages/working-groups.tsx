import { LongCards } from '../components/cards';
import Layout from '../components/layout';

type PageProps = {};

export default function WorkingGroups(props: PageProps) {
  return (
    <Layout>
      <LongCards
        title="Working Groups"
        longCards={[
          {
            href: '#',
            title: 'TITLE',
            subtitle: 'SUBTITLE',
          },
        ]}
      ></LongCards>
    </Layout>
  );
}
