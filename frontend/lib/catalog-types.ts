// This file contains all the types used with the catalog

import { User } from 'next-auth';
export type UserId = string;
export type DMEId = string;
export type VersionId = string;
export type SolutionId = string;
export type GroupId = string;
export type Endorsers = CatalogUser[];
export type SolutionUsers = CatalogUser[];
export type Industry = string;

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
  industries: Industry[];
  parsedSchemaJson: ParsedSchemaJson;
};

// a data model extension id uniquely identifies a data model extension within the catalog
export type DataModelExtensionId = {
  namespace: string;
  packageName: string;
  version: VersionId;
};

export type ParsedSchemaJson =
  | {
      validSchemaJson: true;
      schemaJson: {
        $id: string;
        $schema: string;
        title: string;
        type: 'object';
        properties: {
          [key: string]: unknown;
        };
      };
    }
  | { validSchemaJson: false };

export type CatalogUser = {
  id: UserId;
  kind: 'ngo' | 'company' | 'solutionprovider';
  name: string;
  email: string | null;
  website: string | null;
  logo: string | null;
  extensions_endorsed: {
    id: DMEId;
    version: VersionId;
  }[];
  solutions_used: SolutionId[] | null;
};

export type Collaborator = {
  user: CatalogUser;
  extensions: CatalogDataModelExtension[] | [];
  solutions: ConformingSolution[] | [];
  workingGroups: WorkingGroup[] | [];
};

export type ConformingSolution = {
  id: SolutionId;
  name: string;
  website: string;
  provider: UserId;
  extensions:
    | {
        id: DMEId;
        version: VersionId;
        author: string;
      }[]
    | null;
  providerName: string;
  summary: string | null;
  industries: Industry[] | null;
  users: SolutionUsers | null;
  conformance_tests: SolutionTestResults;
};

export type SolutionTestResults = {
  test: ConformanceTestResult;
  tester: ConformingSolution;
}[];

export type ConformanceTestResult = {
  system_under_test: SolutionId;
  system_tester: SolutionId;
  test_result: 'PACT conformant' | 'ongoing' | 'failed';
  // TO DO: Turn test date into Date ?
  test_date: string;
  pathfinder_version: string;
  extensions_tested:
    | {
        extension: DMEId;
        version: VersionId;
      }[]
    | [];
};

export type Works = {
  extensions:
    | {
        id: DMEId;
        version: VersionId;
        description: string;
        summary: string | null;
        author: string;
      }[]
    | null;
  solutions:
    | {
        id: SolutionId;
        name: string;
        summary: string | null;
        providerName: string;
      }[]
    | null;
};

export type WorkingGroup = {
  id: GroupId;
  name: string;
  email: string | null;
  description: string;
  workInProgress: Works;
  completedWork: Works;
  members: {
    user_id: UserId;
    user: CatalogUser;
  }[];
};
