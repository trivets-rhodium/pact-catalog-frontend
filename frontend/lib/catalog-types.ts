// This file contains all the types used with the catalog

export type UserId = string;
export type DMEId = string;
export type VersionId = string;
export type SolutionId = string;

export type CatalogUser = {
  id: UserId;
  kind: 'ngo' | 'company' | 'solutionprovider';
  name: string;
  website?: string;
  logo?: string;
  extensions_endorsed: {
    id: DMEId;
    version: VersionId;
  }[];
};

export type Endorsers = CatalogUser[];

export type ConformingSolution = {
  id: string;
  name: string;
  website: string;
  provider: string;
  extensions: {
    id: DMEId;
    version: VersionId;
  }[];
};

export type CatalogDataModelExtension = {
  name: DMEId;
  version: VersionId;
  description: string;
  files: string[];
  author: {
    name: string;
    email: string;
    url: string;
  };
  contributors:
    | {
        name: string;
        email: string;
        url: string;
      }[]
    | null;

  license: string;
  catalog_info: {
    summary: string | null;
    status: 'published' | 'draft' | 'deprecated';
    authors: UserId[];
  };
  readmeMd: string | null;
  downloadLink: string | null;
  gitRepositoryUrl: string | null;
  dependencies: DataModelExtensionId[];
  endorsers: Endorsers;
  conformingSolutions: ConformingSolution[];
  versions: VersionId[];
};

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

// a data model extension id uniquely identifies a data model extension within the catalog
export type DataModelExtensionId = {
  namespace: string;
  packageName: string;
  version: VersionId;
};
