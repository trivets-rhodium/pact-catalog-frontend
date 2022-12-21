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

export async function getUser(id: UserId): Promise<CatalogUser> {
  const userPath = path.join(usersDirectory, `${id}.json`);

  const userContent = fs.readFileSync(userPath, 'utf8');
  const user = JSON.parse(userContent);
  const userJson = UserParser.parse(user);

  return {
    ...userJson,
  };
}

export async function getAllUsers() {
  const paths = fs.readdirSync(usersDirectory);

  const allUsersData = paths.map((userFilePath) => {
    const userPath = path.join(usersDirectory, userFilePath);
    const userContent = fs.readFileSync(userPath, 'utf8');
    const user = JSON.parse(userContent);
    const userJson = UserParser.parse(user);

    return userJson;
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
