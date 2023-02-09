// This file contains everything that allows parsing the JSON files from the catalog as the adequate
// types.

import {
  ConformanceTestResult,
  DMEId,
  GroupId,
  Industry,
  SolutionId,
  VersionId,
  WorkingGroup,
  Works,
} from './catalog-types';
import { Schema, z } from 'zod';
import { UserId } from './catalog-types';
import { minimalSetup } from '@uiw/react-codemirror';

export type PackageJsonSchema = {
  name: DMEId;
  version: string;
  description: string;
  files: string[];
  author: {
    name: string;
    email: string;
    url: string;
  };
  contributors?: {
    name: string;
    email: string;
    url: string;
  }[];
  license: string;
  catalog_info: {
    summary?: string;
    status: 'published' | 'draft' | 'deprecated';
    authors: UserId[];
  };
  industries: Industry[];
};

export type MetaSchema = {
  $id: string;
  $schema: string;
  title: string;
  type: 'object';
  properties: {
    [key: string]: {
      // type: string;
      // description: string;
      [key: string]: unknown;
    };
  };
};

export type ConformingSolutionJsonSchema = {
  id: string;
  name: string;
  website: string;
  provider: UserId;
  extensions: {
    id: DMEId;
    version: VersionId;
  }[];
  summary?: string;
  industries: Industry[];
};

export type CatalogUserJsonSchema = {
  id: UserId;
  kind: 'ngo' | 'company' | 'solutionprovider';
  name: string;
  email?: string;
  website?: string;
  logo?: string;
  extensions_endorsed: {
    id: DMEId;
    version: VersionId;
  }[];
  solutions_used?: SolutionId[];
};

export type WorkingGroupSchema = {
  id: GroupId;
  name: string;
  email?: string;
  description: string;
  work_in_progress: {
    extensions?: {
      id: string;
      version: string;
    }[];
    solutions?: {
      id: string;
    }[];
  };
  completed_work?: {
    extensions?: {
      id: string;
      version: string;
    }[];
    solutions?: {
      id: string;
    }[];
  };
  members: {
    user_id: UserId;
  }[];
};

export function parseSchemaJson(schemaJson: string) {
  try {
    // TO DO: use more robust validation;
    const parsedSchemaJson = JSON.parse(schemaJson);
    JsonSchemaParser.parse(parsedSchemaJson);

    return true;
  } catch {
    // TO DO: improve error message;
    alert('Please provide a valid schema.json');

    return false;
  }
}

// WIP:
export const JsonSchemaParser: z.ZodType<MetaSchema> = z.lazy(() =>
  z.object({
    $id: z.string().min(1),
    $schema: z.string().min(1),
    title: z.string().min(1),
    type: z.enum(['object']),
    // TO DO: Make sure that the key has a type field, a description field, and more.
    properties: z.record(
      z.string().min(1),
      z.record(z.string().min(1), z.unknown())
    ),
    // NOT WORKING: attempt to extend an object with static keys with a z.record:
    // properties: z.record(
    //   (z.string().min(1),
    //   z
    //     .object({
    //       type: z.string(),
    //       description: z.string(),
    //     })
    //     .extend(z.record(z.string(), z.unknown())))
    // ),
  })
);

export const UserParser: z.ZodType<CatalogUserJsonSchema> = z.lazy(() =>
  z.object({
    id: z.string(),
    kind: z.enum(['ngo', 'company', 'solutionprovider']),
    name: z.string(),
    email: z.string().optional(),
    website: z.string().optional(),
    logo: z.string().optional(),
    extensions_endorsed: z.array(
      z.object({
        id: z.string().min(1),
        version: z.string().regex(/[0-9]+\.[0-9]+\.[0-9]+/),
      })
    ),
    solutions_used: z.array(z.string().min(1)).optional(),
  })
);

export const PackageJsonParser: z.ZodType<PackageJsonSchema> = z.lazy(() =>
  z.object({
    name: z.string().min(1),
    version: z.string().regex(/[0-9]+\.[0-9]+\.[0-9]+/),
    description: z.string().min(1),
    files: z.array(z.string().min(1)),
    author: z.object({
      name: z.string().min(1),
      email: z.string().email(),
      url: z.string().url(),
    }),
    contributors: z
      .array(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          url: z.string().url(),
        })
      )
      .optional(),
    license: z.string().min(1),
    catalog_info: z.object({
      summary: z.string().optional(),
      status: z.enum(['published', 'draft', 'deprecated']),
      authors: z.array(z.string().min(1)),
    }),
    industries: z.array(z.string().min(1)),
  })
);

export const SolutionParser: z.ZodType<ConformingSolutionJsonSchema> = z.lazy(
  () =>
    z.object({
      id: z.string(),
      name: z.string(),
      website: z.string(),
      provider: z.string(),
      extensions: z.array(
        z.object({
          id: z.string().min(1),
          version: z.string().min(1),
        })
      ),
      summary: z.string().optional(),
      industries: z.array(z.string().min(1)),
    })
);

export const TestResultParser: z.ZodType<ConformanceTestResult> = z.lazy(() =>
  z.object({
    system_under_test: z.string().min(1),
    system_tester: z.string().min(1),
    test_result: z.enum(['passed', 'ongoing', 'failed']),
    test_date: z.string().datetime(),
    tests: z.array(
      z.object({
        extension: z.string().min(1),
        version: z.string().min(1),
      })
    ),
  })
);

export const WorkingGroupParser: z.ZodType<WorkingGroupSchema> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    email: z.string().optional(),
    description: z.string().min(1),
    work_in_progress: z.object({
      extensions: z
        .array(
          z.object({
            id: z.string().min(1),
            version: z.string().min(1),
          })
        )
        .optional(),
      solutions: z.array(z.object({ id: z.string().min(1) })).optional(),
    }),
    completed_work: z
      .object({
        extensions: z
          .array(
            z.object({
              id: z.string().min(1),
              version: z.string().min(1),
            })
          )
          .optional(),
        solutions: z.array(z.object({ id: z.string().min(1) })).optional(),
      })
      .optional(),
    members: z.array(
      z.object({
        user_id: z.string().min(1),
      })
    ),
  })
);
