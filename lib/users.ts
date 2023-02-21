import path from 'path';
import fs from 'fs';
import {
  CatalogDataModelExtension,
  CatalogUser,
  Endorsers,
  SolutionId,
  SolutionUsers,
  UserId,
} from './catalog-types';
import { UserParser } from './catalog-types.schema';
import { getAllExtensions } from './data-model-extensions';

const usersDirectory = path.posix.join(process.cwd(), '../catalog/users');

export async function getUser(id: UserId): Promise<CatalogUser> {
  const basePath = path.join(usersDirectory, `${id}.json`);
  return getUserFromBasePath(basePath);
}

export async function getAllUsers(): Promise<CatalogUser[]> {
  const paths = fs.readdirSync(usersDirectory);

  const allUsersData = paths.map((userFilePath) => {
    const basePath = path.resolve(usersDirectory, userFilePath);
    return getUserFromBasePath(basePath);
  });

  return Promise.all(allUsersData);
}

export async function getEndorsers(
  extension: CatalogDataModelExtension
): Promise<Endorsers> {
  const users = await getAllUsers();

  let endorsers: Endorsers = [];

  for (const user of users) {
    for (const e of user.extensions_endorsed) {
      if (e.id === extension.name) {
        endorsers.push(user);
      }
    }
  }

  return endorsers;
}

export async function getSolutionUsers(id: SolutionId): Promise<SolutionUsers> {
  const users = await getAllUsers();

  let solutionUsers: SolutionUsers = [];

  for (const user of users) {
    if (user.solutions_used) {
      for (const solution of user.solutions_used) {
        if (solution === id) {
          solutionUsers.push(user);
        }
      }
    }
  }

  return solutionUsers;
}

export async function getUserExtensions(
  id: UserId
): Promise<CatalogDataModelExtension[]> {
  const allExtensions = await getAllExtensions();

  const usersExtensions = allExtensions.filter((extension) => {
    extension.catalog_info.authors.includes(id);
  });

  return Promise.all(usersExtensions);
}

async function getUserFromBasePath(basePath: string): Promise<CatalogUser> {
  const userContent = fs.readFileSync(basePath, 'utf-8');
  const userObject = JSON.parse(userContent);
  const parsedUser = UserParser.parse(userObject);

  return {
    ...parsedUser,
    email: parsedUser.email || null,
    website: parsedUser.website || null,
    logo: parsedUser.logo || null,
    solutions_used: parsedUser.solutions_used || null,
  };
}
