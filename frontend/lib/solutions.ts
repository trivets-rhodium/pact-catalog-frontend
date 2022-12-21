import path from 'path';
import fs from 'fs';
import {
  CatalogDataModelExtension,
  ConformingSolution,
  Endorsers,
  SolutionId,
} from './catalog-types';
import { SolutionParser } from './catalog-types.schema';
import { getAllExtensions } from './data-model-extensions';
import { getUser } from './users';

const solutionsDirectory = path.posix.join(
  process.cwd(),
  '../catalog/solutions'
);

export async function getAllSolutionsIds() {
  const solutions = await getAllSolutions();
  return solutions.map((solution) => {
    const { id } = solution;
    return {
      params: {
        id,
      },
    };
  });
}

export async function getSolution(id: SolutionId): Promise<ConformingSolution> {
  const solutionPath = path.join(solutionsDirectory, `${id}.json`);

  const solutionContent = fs.readFileSync(solutionPath, 'utf8');
  const solution = JSON.parse(solutionContent);
  const solutionJson = SolutionParser.parse(solution);

  const providerName = (await getUser(solutionJson.provider)).name;

  return {
    ...solutionJson,
    providerName,
    summary: solutionJson.summary || null,
    // users: await getSolutionUsers(solution),
  };
}

export async function getAllSolutions(): Promise<ConformingSolution[]> {
  const paths = fs.readdirSync(solutionsDirectory);

  const allSolutionsData = paths.map(async (solutionFilePath) => {
    const solutionPath = path.join(solutionsDirectory, solutionFilePath);
    const solutionContent = fs.readFileSync(solutionPath, 'utf8');
    const solution = JSON.parse(solutionContent);
    const solutionJson = SolutionParser.parse(solution);

    return getSolution(solutionJson.id);
  });

  return Promise.all(allSolutionsData);
}

export async function getConformingSolutions(
  extension: CatalogDataModelExtension
): Promise<ConformingSolution[]> {
  const solutions = await getAllSolutions();

  let conformingSolutions: ConformingSolution[] = [];

  for (const solution of solutions) {
    for (const e of solution.extensions) {
      console.log('extension', extension);
      if (e.id === extension.name && e.version === extension.version) {
        conformingSolutions.push(solution);
      }
    }
  }
  return conformingSolutions;
}
