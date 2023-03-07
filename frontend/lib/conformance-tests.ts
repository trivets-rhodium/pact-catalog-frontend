import fs from 'fs';
import path from 'path';
import {
  ConformanceTestResult,
  SolutionId,
  SolutionTestResults,
} from './catalog-types';
import { TestResultParser } from './catalog-types.schema';
import { getSolution } from './solutions';

const conformanceTestsDirectory = path.posix.join(
  process.cwd(),
  '../catalog/conformance-tests'
);

export async function getAllTestResults(): Promise<ConformanceTestResult[]> {
  const paths = fs.readdirSync(conformanceTestsDirectory);

  const allTestResultsData = paths.map((testResultFilePath) => {
    const basePath = path.resolve(
      conformanceTestsDirectory,
      testResultFilePath
    );
    return getTestResultFromBasePath(basePath);
  });

  return Promise.all(allTestResultsData);
}

export async function getSolutionTestResults(
  id: SolutionId
): Promise<SolutionTestResults> {
  const testResults = await getAllTestResults();

  const solutionTestResults: SolutionTestResults = [];

  for (const test of testResults) {
    if (test.system_under_test === id) {
      const tester = await getSolution(test.system_tester);

      solutionTestResults.push({
        test,
        tester,
      });
    }
  }

  return solutionTestResults;
}

async function getTestResultFromBasePath(
  basePath: string
): Promise<ConformanceTestResult> {
  const testResultContent = fs.readFileSync(basePath, 'utf-8');
  const testResultObject = JSON.parse(testResultContent);
  const parsedTestResult = TestResultParser.parse(testResultObject);

  return {
    ...parsedTestResult,
  };
}
