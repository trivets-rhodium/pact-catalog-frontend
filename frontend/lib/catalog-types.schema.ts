import { DMEId } from './catalog-types';
import { z } from 'zod';
import { CatalogUser, UserId } from './catalog-types';

export type PackageJsonSchema = {
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
    summary?: string;
    status: 'published' | 'draft' | 'deprecated';
    authors: UserId[];
  };
};

export const UserParser: z.ZodType<CatalogUser> = z.lazy(() =>
  z.object({
    id: z.string(),
    kind: z.enum(['ngo', 'company', 'solutionprovider']),
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
    contributors: z
      .array(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          url: z.string().url(),
        })
      )
      .optional(),
    author: z.string().min(1),
    license: z.string().min(1),
    catalog_info: z.object({
      summary: z.string().min(1).optional(),
      status: z.enum(['published', 'draft', 'deprecated']),
      authors: z.array(z.string().min(1)),
    }),
  })
);
