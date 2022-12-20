import { ConformingSolution, DMEId } from './catalog-types';
import { z } from 'zod';
import { CatalogUser, UserId } from './catalog-types';

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
};

export const UserParser: z.ZodType<CatalogUser> = z.lazy(() =>
  z.object({
    id: z.string(),
    kind: z.enum(['ngo', 'company', 'solutionprovider']),
    name: z.string(),
    website: z.string().optional(),
    logo: z.string().optional(),
    extensions_endorsed: z.array(
      z.object({
        id: z.string().min(1),
        version: z.string().regex(/[0-9]+\.[0-9]+\.[0-9]+/),
      })
    ),
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
      summary: z.string().min(1).optional(),
      status: z.enum(['published', 'draft', 'deprecated']),
      authors: z.array(z.string().min(1)),
    }),
  })
);

export const SolutionParser: z.ZodType<ConformingSolution> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    website: z.string(),
    provider: z.object({
      id: z.string(),
      name: z.string(),
    }),
    extensions_employed: z.array(
      z.object({
        name: z.string().min(1),
        version: z.string().min(1),
      })
    ),
  })
);
