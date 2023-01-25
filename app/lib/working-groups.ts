import path from 'path';
import { WorkingGroup } from './catalog-types';
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
