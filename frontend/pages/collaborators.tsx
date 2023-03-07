import { GetStaticProps } from 'next';
import { Cards, collaboratorCards } from '../components/cards';
import Layout from '../components/layout';
import {
  CatalogDataModelExtension,
  CatalogUser,
  Collaborator,
  ConformingSolution,
  UserId,
  WorkingGroup,
} from '../lib/catalog-types';
import { getAllCollaborators } from '../lib/collaborators';
import { getAllExtensions } from '../lib/data-model-extensions';
import { getAllSolutions } from '../lib/solutions';
import { getAllUsers, getUserExtensions } from '../lib/users';
import { getAllWorkingGroups } from '../lib/working-groups';

type PageProps = {
  collaborators: Collaborator[];
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const collaborators = await getAllCollaborators();

  return {
    props: {
      collaborators,
    },
  };
};

export default function Collaborators(props: PageProps) {
  const { collaborators } = props;

  // Filter mock users;
  const filteredUsers = collaborators.filter(
    (user) =>
      user.user.id !== 'some-steel-manufacturer' &&
      user.user.id !== 'some-solutionprovider' &&
      user.user.id !== 'sustainable-steel-software'
  );

  return (
    <Layout>
      <Cards
        title={'Collaborators (being updated)'}
        cardsContent={filteredUsers}
        render={collaboratorCards}
      />

      {/* <ul className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredUsers.map((user) => {
          return (
            <li key={user.user.id}>
              <UserCard
                user={user.user}
                extensions={user.userExtensions}
                solutions={user.userSolutions}
                workingGroups={user.workingGroups}
              />
            </li>
          );
        })}
      </ul> */}
    </Layout>
  );
}
