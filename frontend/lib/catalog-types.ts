// This file contains all the types used with the catalog

export type UserId = string;
export type DMEId = string;
export type VersionId = string;

export type CatalogUser = {
  id: UserId;
  kind: 'ngo' | 'company' | 'solutionprovider';
  website?: string;
  logo?: string;
  extensions_endorsed: {
    id: DMEId;
    version: VersionId;
  }[];
};

export type ConformingSolution = {
  id: string;
  name: string;
  website: string;
};

export type CatalogDataModelExtension = {
  name: DMEId;
  version: VersionId;
  description: string;
  files: string[];
  contributors: {
    name: string;
    email: string;
    url: string;
  }[] | null;
  author: string;
  license: string;
  catalog_info: {
    status: 'published' | 'draft' | 'deprecated';
    authors: UserId[];
  };
  readmeMd: string | null;
  downloadLink: string | null;
  gitRepositoryUrl: string | null;
  dependencies: DataModelExtensionId[];
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

export type Documentation = string;

// a data model extension id uniquely identifies a data model extension within the catalog
export type DataModelExtensionId = {
  namespace: string;
  packageName: string;
  version: VersionId;
};

export type DetailTab = {
  name: string;
  content: JSX.Element,
};

export type ExtensionDetails = DetailTab[];
