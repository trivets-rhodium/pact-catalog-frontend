import path from 'path';
import { CatalogUser, GroupId, UserId, WorkingGroup } from './catalog-types';
import fs from 'fs';
import { WorkingGroupParser, WorkingGroupSchema } from './catalog-types.schema';
import { globby } from 'globby';
import { getUser } from './users';

const workingGroupsDirectory = path.posix.join(
  process.cwd(),
  '../catalog/working-groups'
);

export async function getAllWorkingGroups(): Promise<WorkingGroup[]> {
  const paths = fs.readdirSync(workingGroupsDirectory);

  const allWorkingGroupsData = paths.map((workingGroupFilePath) => {
    const basePath = path.resolve(workingGroupsDirectory, workingGroupFilePath);
    return getWorkingGroupFromBasePath(basePath);
  });

  return Promise.all(allWorkingGroupsData);
}

export async function getAllWorkingGroupsIds() {
  const allWorkingGroups = await getAllWorkingGroups();

  return allWorkingGroups.map((workingGroup) => {
    const { id } = workingGroup;
    return {
      params: {
        id,
      },
    };
  });
}

export async function getWorkingGroup(id: GroupId): Promise<WorkingGroup> {
  const basePath = path.join(workingGroupsDirectory, `${id}.json`);

  return getWorkingGroupFromBasePath(basePath);
}

async function getWorkingGroupFromBasePath(
  basePath: string
): Promise<WorkingGroup> {
  const groupContent = fs.readFileSync(basePath, 'utf-8');
  const workingGroup = JSON.parse(groupContent);
  const groupJson = WorkingGroupParser.parse(workingGroup);

  return {
    ...groupJson,
    members: await getMembers(groupJson),
  };
}

function getMembers(
  workingGroup: WorkingGroupSchema
): Promise<{ user_id: UserId; user: CatalogUser }[]> {
  const members = workingGroup.members.map(async (member) => {
    const user = await getUser(member.user_id);
    return {
      user_id: member.user_id,
      user: user,
    };
  });
  return Promise.all(members);
}
