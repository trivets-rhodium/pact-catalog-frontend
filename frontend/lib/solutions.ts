import path, { parse } from 'path';
import fs from 'fs';
import {
  CatalogDataModelExtension,
  ConformingSolution,
  Endorsers,
  SolutionId,
} from './catalog-types';
import { SolutionParser } from './catalog-types.schema';
import { getAllExtensions } from './data-model-extensions';
import { getSolutionUsers, getUser } from './users';
import { getSolutionTestResults } from './conformance-tests';

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
  const basePath = path.join(solutionsDirectory, `${id}.json`);
  return getSolutionFromBasePath(basePath);
}

export async function getAllSolutions(): Promise<ConformingSolution[]> {
  const paths = fs.readdirSync(solutionsDirectory);

  const allSolutionsData = paths.map((solutionFilePath) => {
    const basePath = path.resolve(solutionsDirectory, solutionFilePath);
    return getSolutionFromBasePath(basePath);
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

async function getSolutionFromBasePath(
  basePath: string
): Promise<ConformingSolution> {
  const solutionContent = fs.readFileSync(basePath, 'utf-8');
  const solutionObject = JSON.parse(solutionContent);
  const parsedSolution = SolutionParser.parse(solutionObject);

  const solutionId = path.basename(basePath, '.json');

  return {
    ...parsedSolution,
    providerName: (await getUser(parsedSolution.provider)).name,
    summary: parsedSolution.summary || null,
    users: await getSolutionUsers(solutionId),
    conformance_tests: (await getSolutionTestResults(solutionId)) || null,
  };
}
