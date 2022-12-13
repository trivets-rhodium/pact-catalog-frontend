import { CatalogDataModelExtension, DMEId, Documentation } from '../lib/catalog-types';
import fs from 'fs';
import { remark } from 'remark';
import html from 'remark-html';
import path from 'path';
import { globby } from 'globby';
import { DataModelExtensionParser } from './catalog-types.schema';

const extensionsDirectory = path.posix.join(
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

export async function getAllDMEIds() {
  const extensions = await getAllExtensions();

  return extensions.map((extension) => {
    const [author, name] = extension.name.split('/');
    return {
      params: {
        author: author,
        id: name,
      },
    };
  })
}

export async function getExtension(dataModelId: DMEId): Promise<[CatalogDataModelExtension, Documentation]> {
  const packagePath = await globby(path.join(extensionsDirectory, dataModelId), {
    expandDirectories: {
      files: ['package.json'],
    },
  });

  const packageContent = fs.readFileSync(packagePath[0], 'utf8');
  const extension = JSON.parse(packageContent);

  const readmePath = await globby(path.join(extensionsDirectory, dataModelId), {
    expandDirectories: {
      files: ['README.md'],
    },
  });

  let markDown
  try {
    markDown = fs.readFileSync(readmePath[0], 'utf-8');
  } catch (error) {
    markDown = 'No README file is available'
    console.log(error)
  }

  const processedMarkDown = await remark().use(html).process(markDown);
  const readmeHtml = processedMarkDown.toString();

  return [extension, readmeHtml];
}
