import path from 'path';
import { GroupId, WorkingGroup } from './catalog-types';
import fs from 'fs';
import { WorkingGroupParser } from './catalog-types.schema';
import { globby } from 'globby';

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
  };
}
