// This file contains all the types used with the catalog

export type UserId = string;
export type DMEId = string;
export type VersionId = string;
export type SolutionId = string;
export type Endorsers = CatalogUser[];
export type SolutionUsers = CatalogUser[];

export type CatalogUser = {
  id: UserId;
  kind: 'ngo' | 'company' | 'solutionprovider';
  name: string;
  website: string | null;
  logo: string | null;
  extensions_endorsed: {
    id: DMEId;
    version: VersionId;
  }[];
  solutions_used: SolutionId[] | null;
};

export type ConformingSolution = {
  id: SolutionId;
  name: string;
  website: string;
  provider: UserId;
  extensions: {
    id: DMEId;
    version: VersionId;
  }[];
  providerName: string;
  summary: string | null;
  // users: SolutionUsers | null;
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

// a data model extension id uniquely identifies a data model extension within the catalog
export type DataModelExtensionId = {
  namespace: string;
  packageName: string;
  version: VersionId;
};
