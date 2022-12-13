import { z } from "zod";
import { CatalogDataModelExtension, CatalogUser } from "./catalog-types";


export const UserParser: z.ZodType<CatalogUser> = z.lazy(() =>
  z.object({
    id: z.string(),
    kind: z.enum(["ngo", "company", "solutionprovider"]),
    website: z.string().optional(),
    logo: z.string().optional(),
    extensions_endorsed: z.array(
      z.object({
        id: z.string().min(1),
        version: z.string().regex(/[0-9]+\.[0-9]+\.[0-9]+/),
      })
    )
  })
);

export const DataModelExtensionParser: z.ZodType<CatalogDataModelExtension> = z.lazy(() =>
  z.object({
    name: z.string().min(1),
    version: z.string().regex(/[0-9]+\.[0-9]+\.[0-9]+/),
    description: z.string().min(1),
    files: z.array(z.string().min(1)),
    contributors: z.array(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        url: z.string().url(),
      })
    ).optional(),
    author: z.string().min(1),
    license: z.string().min(1),
    catalog_info: z.object({
      status: z.enum(["published", "draft", "deprecated"]),
      authors: z.array(z.string().min(1)),
    })
  })
);
