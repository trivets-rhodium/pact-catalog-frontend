import {
  CatalogDataModelExtension,
  DataModelExtensionId,
  DMEId,
  VersionId,
} from '../lib/catalog-types';
import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import { PackageJsonParser } from './catalog-types.schema';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getConformingSolutions, getSolution } from './solutions';
import { getEndorsers } from './users';

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

  const allExtensionsData = paths.map((packageJsonPath) => {
    let basePath = path.resolve(packageJsonPath, '..');
    return getExtensionFromBasepath(basePath);
  });

  return Promise.all(allExtensionsData);
}

export async function getLatestExtensionsSorted(): Promise<
  CatalogDataModelExtension[]
> {
  const allExtensions = getAllExtensions();

  let latestVersions: { name: DMEId; versionId: VersionId }[] = [];

  for (const extension of await allExtensions) {
    const name = extension.name;
    const versionId = extension.versions.sort().pop();
    versionId !== undefined && latestVersions.push({ name, versionId });
  }

  console.log('latestVersions', latestVersions);

  const latestExtensions = (await allExtensions).filter((extension) => {
    for (const e of latestVersions) {
      if (e.name === extension.name && e.versionId === extension.version) {
        return extension;
      }
    }
  });

  return latestExtensions.sort((a, b) => {
    if (a.version > b.version) {
      return -1;
    } else {
      return 1;
    }
  });
}

export function toExtensionId(
  dataModelExtension: CatalogDataModelExtension
): DataModelExtensionId {
  const [namespace, packageName] = dataModelExtension.name.split('/');
  return {
    namespace,
    packageName,
    version: dataModelExtension.version,
  };
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
        version,
      },
    };
  });
}

export async function getExtension(
  id: DataModelExtensionId
): Promise<CatalogDataModelExtension> {
  const basePath = path.join(
    extensionsDirectory,
    id.namespace,
    id.packageName,
    id.version
  );
  return getExtensionFromBasepath(basePath);
}

async function getExtensionFromBasepath(
  basePath: string
): Promise<CatalogDataModelExtension> {
  const packagePath = path.join(basePath, 'package.json');
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const extension = JSON.parse(packageContent);
  const packageJson = PackageJsonParser.parse(extension);

  return {
    ...packageJson,
    catalog_info: {
      ...packageJson.catalog_info,
      summary: packageJson.catalog_info.summary || null,
    },
    readmeMd: (await readReadmeMd(basePath)) || null,
    dependencies: [
      {
        namespace: '@wbcsd',
        packageName: 'product-footprint',
        version: '2.0.0',
      },
    ],
    endorsers: await getEndorsers(extension),
    conformingSolutions: await getConformingSolutions(extension),
    versions: await getVersions(basePath),
    downloadLink: null,
    gitRepositoryUrl: null,
    contributors: packageJson.contributors || null,
  };
}

async function readReadmeMd(basePath: string): Promise<string | undefined> {
  const readmePath = path.join(basePath, 'documentation/README.md');

  try {
    return fs.readFileSync(readmePath, 'utf-8');
  } catch (error) {
    console.log(error);
  }

  return undefined;
}

async function getVersions(basePath: string): Promise<VersionId[]> {
  const packagePath = path.join(basePath, '../');

  return fs.readdirSync(packagePath).sort().reverse();
}
