import { CatalogDataModelExtension, DataModelExtensionId, DMEId, Documentation } from '../lib/catalog-types';
import fs from 'fs';
import { remark } from 'remark';
import html from 'remark-html';
import path from 'path';
import { globby } from 'globby';
import { DataModelExtensionParser } from './catalog-types.schema';

const extensionsDirectory = path.join(
  process.cwd(),
  '../catalog/data-model-extensions'
);

export async function getAllExtensions(): Promise<CatalogDataModelExtension[]> {
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

export async function getAllDataModelExtensionIds() {
  const extensions = await getAllExtensions();

  return extensions.map((extension) => {
    const [namespace, packageName] = extension.name.split('/');
    const version = extension.version;
    return {
      params: {
        namespace,
        packageName,
        version
      },
    };
  });
}

export async function getExtension(id: DataModelExtensionId): Promise<[CatalogDataModelExtension, Documentation]> {
  const basePath = path.join(extensionsDirectory, id.namespace, id.packageName, id.version);

  const packagePath = path.join(basePath, 'package.json');

  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const extension = JSON.parse(packageContent);

  const readmePath = path.join(basePath, 'documentation/README.md');

  let markDown
  try {
    markDown = fs.readFileSync(readmePath, 'utf-8');
  } catch (error) {
    markDown = 'No README file is available'
    console.log(error)
  }

  const processedMarkDown = await remark().use(html).process(markDown);
  const readmeHtml = processedMarkDown.toString();

  return [extension, readmeHtml];
}
