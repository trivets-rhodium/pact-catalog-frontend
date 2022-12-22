import path from 'path';
import fs from 'fs';
import {
  CatalogDataModelExtension,
  CatalogUser,
  DataModelExtensionId,
  Endorsers,
  UserId,
} from './catalog-types';
import { UserParser } from './catalog-types.schema';
import { getExtension } from './data-model-extensions';
import { globby } from 'globby';
import { array } from 'zod';

const usersDirectory = path.posix.join(process.cwd(), '../catalog/users');

async function getUserFromBasePath(basePath: string): Promise<CatalogUser> {
  const userPath = path.resolve(basePath);
  const userContent = fs.readFileSync(userPath, 'utf-8');
  const userObject = JSON.parse(userContent);
  const parsedUser = UserParser.parse(userObject);

  return {
    ...parsedUser,
    website: parsedUser.website || null,
    logo: parsedUser.logo || null,
    solutions_used: parsedUser.solutions_used || null,
  };
}

export async function getUser(id: UserId): Promise<CatalogUser> {
  const basePath = path.join(usersDirectory, `${id}.json`);
  return getUserFromBasePath(basePath);
}

export async function getAllUsers(): Promise<CatalogUser[]> {
  const paths = fs.readdirSync(usersDirectory);

  const allUsersData = paths.map((userFilePath) => {
    const userPath = path.join(usersDirectory, userFilePath);
    const userContent = fs.readFileSync(userPath, 'utf8');
    const user = JSON.parse(userContent);
    const userJson = UserParser.parse(user);

    return {
      ...userJson,
      website: userJson.website || null,
      logo: userJson.logo || null,
      solutions_used: userJson.solutions_used || null,
    };
  });

  return allUsersData;
}

export async function getEndorsers(
  extension: CatalogDataModelExtension
): Promise<Endorsers> {
  const users = await getAllUsers();
  console.log('users:', users);

  let endorsers: CatalogUser[] = [];

  for (const user of users) {
    for (const e of user.extensions_endorsed) {
      if (e.id === extension.name) {
        endorsers.push(user);
      }
    }
  }

  return endorsers;
}
