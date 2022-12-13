// This file contains all the types used with the catalog

export type UserId = string;
export type DMEId = string;

export type CatalogUser = {
  id: UserId;
  kind: 'ngo' | 'company' | 'solutionprovider',
  website?: string;
  logo?: string;
  extensions_endorsed: {
    "id": DMEId,
    "version": string
  }[];
}

export type CatalogDataModelExtension = {
  name: DMEId;
  version: string;
  description: string;
  files: string[];
  contributors?: {
    name: string;
    email: string;
    url: string;
  }[];
  author: string;
  license: string;
  catalog_info: {
    status: 'published' | 'draft' | 'deprecated';
    authors: UserId[]
  }
}

export type Documentation = string;
