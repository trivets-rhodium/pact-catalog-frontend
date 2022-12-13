import { CatalogDataModelExtension } from '../lib/catalog-types';
import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import { DataModelExtensionParser } from './catalog-types.schema';

const extensionsDirectory = path.posix.join(
  process.cwd(),
  '../catalog/data-model-extensions'
);

export async function getAllExtensionsData(): Promise<CatalogDataModelExtension[]> {
  const paths = await globby(extensionsDirectory, {
    expandDirectories: {
      files: ['package.json'],
    },
  });

  const allExtensionsData = paths.map((path) => {
    const packageContent = fs.readFileSync(path, 'utf8');

    const extension = JSON.parse(packageContent);
    return DataModelExtensionParser.parse(extension);
  });

  return allExtensionsData;
}
