import { CatalogDataModelExtension, DataModelExtensionId, DetailTab, ExtensionDetails } from '../lib/catalog-types';
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

export async function getExtension(id: DataModelExtensionId): Promise<CatalogDataModelExtension> {
  const basePath = path.join(extensionsDirectory, id.namespace, id.packageName, id.version);

  const packagePath = path.join(basePath, 'package.json');

  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const extension = JSON.parse(packageContent);

  return extension;
}

export async function getReadmeTab(id: DataModelExtensionId): Promise<DetailTab> {
  const basePath = path.join(extensionsDirectory, id.namespace, id.packageName, id.version);

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
  const readme = { name: 'Read Me', content: readmeHtml };

  return readme
}

export async function getExploreTab(id: DataModelExtensionId): Promise<DetailTab> {
  const extension = await getExtension(id);

  const download = 'TO DO: Please download this package via this link.'
  const repository = path.join('https://github.com/sine-fdn/pact-catalog/catalog/', `${id.namespace}/${id.packageName}/${id.version}`);
  const lastPublished = 'TO DO: Last Published';
  const contact = extension.author;

  const explore = {
    name: 'Explore',
    content: {
      download,
      repository,
      lastPublished,
      contact
    }
  }

  return explore
}

export async function getUsageTab(id:DataModelExtensionId): Promise<DetailTab> {
  const extension = await getExtension(id);

  const downloadsWeekly = 'TO DO: Downloads (Weekly)';
  const dependencies = 'TO DO: Dependencies';
  const conformingSolutions = 'TO DO: Conforming Solutions';

  const usage = {
    name: 'Usage',
    content: {
      downloadsWeekly,
      dependencies,
      conformingSolutions
    }
  };

  return usage
}

export async function getVersionTab(id:DataModelExtensionId): Promise<DetailTab> {
  const extension = await getExtension(id);

  const currentTags = extension.version;
  const versionHistory = 'TO DO: Version History';

  const version = {
    name: 'Version',
    content: {
      currentTags,
      versionHistory
    }
  };

  return version
}

export async function getExtensionDetails(id: DataModelExtensionId): Promise<ExtensionDetails> {
  const readme = await getReadmeTab(id);
  const explore = await getExploreTab(id);
  const usage = await getUsageTab(id);
  const version = await getVersionTab(id);

  return [readme, explore, usage, version]
}
