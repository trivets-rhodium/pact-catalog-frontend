import { GetStaticProps } from 'next';
import { Cards, collaboratorCards } from '../components/cards';
import Layout from '../components/layout';
import {
  CatalogDataModelExtension,
  CatalogUser,
  ConformingSolution,
  UserId,
  WorkingGroup,
} from '../lib/catalog-types';
import { getAllExtensions } from '../lib/data-model-extensions';
import { getAllSolutions } from '../lib/solutions';
import { getAllUsers, getUserExtensions } from '../lib/users';
import { getAllWorkingGroups } from '../lib/working-groups';

export type EnrichedUser = {
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
  let allSolutions = await getAllSolutions();
  let allWorkingGroups = await getAllWorkingGroups();

  const enrichedUsers = allUsers.map((user) => {
    const userExtensions = allExtensions.filter((extension) => {
      return extension.catalog_info.authors.includes(user.id);
    });

    const userSolutions = allSolutions.filter((solution) => {
      return solution.provider === user.id;
    });

    const workingGroups = allWorkingGroups.filter((group) => {
      const collaboratorsUserIds: UserId[] = group.members.map((member) => {
        return member.user_id;
      });

      return collaboratorsUserIds.includes(user.id);
    });

    return { user, userExtensions, userSolutions, workingGroups };
  });

  return {
    props: {
      enrichedUsers,
    },
  };
};

export default function Collaborators(props: PageProps) {
  const { enrichedUsers } = props;

  // Filter mock users;
  const filteredUsers = enrichedUsers.filter(
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
        cardStyle={'collaborator-card'}
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
