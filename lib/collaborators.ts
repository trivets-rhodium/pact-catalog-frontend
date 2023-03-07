import { UserId } from './catalog-types';
import { getAllExtensions } from './data-model-extensions';
import { getAllSolutions } from './solutions';
import { getAllUsers, getUser } from './users';
import { getAllWorkingGroups } from './working-groups';

export async function getAllCollaborators() {
  const allUsers = await getAllUsers();
  const allExtensions = await getAllExtensions();
  const allSolutions = await getAllSolutions();
  const allWorkingGroups = await getAllWorkingGroups();

  const collaborators = allUsers.map((user) => {
    const extensions = allExtensions.filter((extension) => {
      return extension.catalog_info.authors.includes(user.id);
    });

    const solutions = allSolutions.filter((solution) => {
      return solution.provider === user.id;
    });

    const workingGroups = allWorkingGroups.filter((group) => {
      const collaboratorsUserIds: UserId[] = group.members.map((member) => {
        return member.user_id;
      });

      return collaboratorsUserIds.includes(user.id);
    });

    return { user, extensions, solutions, workingGroups };
  });

  return collaborators;
}

export async function getCollaborator(userId: UserId) {
  const user = await getUser(userId);
  const allExtensions = await getAllExtensions();
  const allSolutions = await getAllSolutions();
  const allWorkingGroups = await getAllWorkingGroups();
  const extensions = allExtensions.filter((extension) => {
    return extension.catalog_info.authors.includes(userId);
  });

  const solutions = allSolutions.filter((solution) => {
    return solution.provider === userId;
  });

  const workingGroups = allWorkingGroups.filter((group) => {
    const collaboratorsUserIds: UserId[] = group.members.map((member) => {
      return member.user_id;
    });

    return collaboratorsUserIds.includes(userId);
  });

  return { user, extensions, solutions, workingGroups };
}
