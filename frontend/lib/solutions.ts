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

const solutionsDirectory = path.posix.join(
  process.cwd(),
  '../catalog/solutions'
);

export async function getSolution(id: SolutionId): Promise<ConformingSolution> {
  const solutionPath = path.join(solutionsDirectory, `${id}.json`);

  const solutionContent = fs.readFileSync(solutionPath, 'utf8');
  const solution = JSON.parse(solutionContent);
  const solutionJson = SolutionParser.parse(solution);

  return solutionJson;
}

export async function getAllSolutions(): Promise<ConformingSolution[]> {
  const paths = fs.readdirSync(solutionsDirectory);

  const allSolutionsData = paths.map((solutionFilePath) => {
    const solutionPath = path.join(solutionsDirectory, solutionFilePath);
    const solutionContent = fs.readFileSync(solutionPath, 'utf8');
    const solution = JSON.parse(solutionContent);
    const solutionJson = SolutionParser.parse(solution);

    return solutionJson;
  });

  return allSolutionsData;
}

export async function getConformingSolutions(
  extension: CatalogDataModelExtension
): Promise<ConformingSolution[]> {
  const solutions = await getAllSolutions();

  let conformingSolutions: ConformingSolution[] = [];

  for (const solution of solutions) {
    for (const e of solution.extensions_employed) {
      console.log('extension', extension);
      if (e.name === extension.name && e.version === extension.version) {
        conformingSolutions.push(solution);
      }
    }
  }
  return conformingSolutions;
}
