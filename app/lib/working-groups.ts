import path from 'path';
import {
  CatalogUser,
  GroupId,
  UserId,
  WorkingGroup,
  WorkInProgress,
} from './catalog-types';
import fs from 'fs';
import { WorkingGroupParser, WorkingGroupSchema } from './catalog-types.schema';
import { getUser } from './users';
import { getExtension } from './data-model-extensions';
import { getSolution } from './solutions';

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

  console.log('workingGroup', workingGroup);
  return {
    ...groupJson,
    email: groupJson.email || null,
    members: await getMembers(groupJson),
    workInProgress: await getWorkInProgress(groupJson),
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

async function getWorkInProgress(
  workingGroup: WorkingGroupSchema
): Promise<WorkInProgress> {
  const extensions = await getWorkInProgressExtensions(workingGroup);
  const solutions = await getWorkInProgressSolutions(workingGroup);

  return {
    extensions,
    solutions,
  };
}

function getWorkInProgressExtensions(workingGroup: WorkingGroupSchema): Promise<
  {
    id: string;
    version: string;
    description: string;
    summary: string | null;
    author: string;
  }[]
> {
  const extensions = workingGroup.work_in_progress.extensions.map(async (e) => {
    const namespace = e.id.split('/')[0];
    const packageName = e.id.split('/')[1];
    const parsedVersion = e.version;

    const extensionId = {
      namespace,
      packageName,
      version: parsedVersion,
    };

    const extension = await getExtension(extensionId);

    const {
      name,
      version,
      description,
      catalog_info: { summary },
      author,
    } = extension;

    return {
      id: name,
      version,
      description,
      summary,
      author: author.name,
    };
  });

  return Promise.all(extensions);
}

function getWorkInProgressSolutions(
  workingGroup: WorkingGroupSchema
): Promise<
  { id: string; name: string; summary: string | null; providerName: string }[]
> {
  const solutions = workingGroup.work_in_progress.solutions.map(async (s) => {
    const solution = await getSolution(s.id);

    const { id, name, summary, providerName } = solution;

    return {
      id,
      name,
      summary,
      providerName,
    };
  });

  return Promise.all(solutions);
}
