import { GetStaticProps } from 'next';
import { UserCard } from '../components/cards';
import Layout from '../components/layout';
import {
  CatalogDataModelExtension,
  CatalogUser,
  ConformingSolution,
  UserId,
  WorkingGroup,
} from '../lib/catalog-types';
import { getAllExtensions } from '../lib/data-model-extensions';
import { getAllUsers, getUserExtensions } from '../lib/users';

type EnrichedUser = {
  user: CatalogUser;
  userExtensions?: CatalogDataModelExtension[];
  userSolutions?: ConformingSolution[];
  workingGroups?: WorkingGroup[];
};
type PageProps = {
  enrichedUsers: EnrichedUser[];
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  let allUsers = await getAllUsers();
  let allExtensions = await getAllExtensions();

  const enrichedUsers = allUsers.map((user) => {
    const userExtensions = allExtensions.filter((extension) => {
      return extension.catalog_info.authors.includes(user.id);
    });

    return { user, userExtensions };
  });

  return {
    props: {
      enrichedUsers,
    },
  };
};

export default function Members(props: PageProps) {
  const { enrichedUsers } = props;

  return (
    <Layout>
      <h1>Members</h1>
      <ul className="grid grid-cols-1 gap-10 sm:grid-cols-3">
        {enrichedUsers.map((user) => {
          return (
            <li key={user.user.id}>
              <UserCard
                name={user.user.name}
                extensions={user.userExtensions}
              />
            </li>
          );
        })}
      </ul>
    </Layout>
  );
}
