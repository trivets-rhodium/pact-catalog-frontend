import { UserCard } from '../components/cards';
import Layout from '../components/layout';
import { CatalogUser } from '../lib/catalog-types';

type PageProps = {
  allUsers: CatalogUser[];
};

export default function Members(props: PageProps) {
  return (
    <Layout>
      <h1>Members</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3">
        <UserCard id={'userId'} name={'A user'} />
        <UserCard id={'userId'} name={'A user'} />
        <UserCard id={'userId'} name={'A user'} />
      </div>
    </Layout>
  );
}
