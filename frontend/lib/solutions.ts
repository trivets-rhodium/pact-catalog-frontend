import path from 'path';
import fs from 'fs';
import { ConformingSolution, SolutionId } from './catalog-types';
import { SolutionParser } from './catalog-types.schema';

const solutionsDirectory = path.posix.join(
  process.cwd(),
  '../catalog/solutions'
);

export async function getSolution(id: SolutionId): Promise<ConformingSolution> {
  const solutionPath = path.join(solutionsDirectory, `${id}.json`);

  const solutionContent = fs.readFileSync(solutionPath, 'utf8');
  const solution = JSON.parse(solutionContent);
  const solutionJson = SolutionParser.parse(solution);

  return solutionJson
}
