import path from 'path';
import {
  CatalogUser,
  GroupId,
  UserId,
  WorkingGroup,
  Works,
} from './catalog-types';
import fs from 'fs';
import { WorkingGroupParser, WorkingGroupSchema } from './catalog-types.schema';
import { getUser } from './users';
import { getExtension } from './data-model-extensions';
import { getSolution } from './solutions';

const workingGroupsDirectory = '/catalog/working-groups';

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
    workInProgress: (await getWorkInProgress(groupJson)) || null,
    completedWork: (await getCompletedWork(groupJson)) || null,
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
): Promise<Works> {
  const extensions = workingGroup.work_in_progress.extensions
    ? await getWorkInProgressExtensions(workingGroup)
    : null;

  const solutions = workingGroup.work_in_progress.solutions
    ? await getWorkInProgressSolutions(workingGroup)
    : null;

  return {
    extensions,
    solutions,
  };
}

function getWorkInProgressExtensions(workingGroup: WorkingGroupSchema): Promise<
  | {
      id: string;
      version: string;
      description: string;
      summary: string | null;
      author: string;
    }[]
  | null
> {
  if (workingGroup.work_in_progress.extensions !== undefined) {
    const extensions = workingGroup.work_in_progress.extensions.map(
      async (e) => {
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
      }
    );
    return Promise.all(extensions);
  } else {
    return Promise.resolve(null);
  }
}

function getWorkInProgressSolutions(
  workingGroup: WorkingGroupSchema
): Promise<
  | { id: string; name: string; summary: string | null; providerName: string }[]
  | null
> {
  if (workingGroup.work_in_progress.solutions) {
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
  } else {
    return Promise.resolve(null);
  }
}

async function getCompletedWork(
  workingGroup: WorkingGroupSchema
): Promise<Works> {
  const extensions = workingGroup.completed_work?.extensions
    ? await getCompletedWorkExtensions(workingGroup)
    : null;

  const solutions = workingGroup.completed_work?.solutions
    ? await getCompletedWorkSolutions(workingGroup)
    : null;

  return {
    extensions,
    solutions,
  };
}

function getCompletedWorkExtensions(workingGroup: WorkingGroupSchema): Promise<
  | {
      id: string;
      version: string;
      description: string;
      summary: string | null;
      author: string;
    }[]
  | null
> {
  if (workingGroup.completed_work?.extensions !== undefined) {
    const extensions = workingGroup.completed_work?.extensions.map(
      async (e) => {
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
      }
    );
    return Promise.all(extensions);
  } else {
    return Promise.resolve(null);
  }
}

function getCompletedWorkSolutions(
  workingGroup: WorkingGroupSchema
): Promise<
  | { id: string; name: string; summary: string | null; providerName: string }[]
  | null
> {
  if (workingGroup.completed_work?.solutions) {
    const solutions = workingGroup.completed_work?.solutions.map(async (s) => {
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
  } else {
    return Promise.resolve(null);
  }
}
