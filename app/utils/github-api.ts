import { Octokit } from 'octokit';
import fs from 'fs';

// Creates Octokit with access token passed as env variable;
const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
});

type FormInput = {
  publisherName: string;
  publisherUserId: string;
  publisherEmail: string;
  publisherUrl: string;
  packageName: string;
  description: string;
  industries: string[];
  version: string;
  summary: string;
  schemaJson: string;
  readme: string;
};

export default async function submitToGithub(formInput: FormInput) {
  const {
    publisherName,
    publisherUserId,
    publisherEmail,
    publisherUrl,
    packageName,
    description,
    industries,
    version,
    summary,
    schemaJson,
    readme,
  } = formInput;

  // Fetches main branch's reference in order to retrieve its sha;
  const reference = await octokit.request(
    'GET /repos/{owner}/{repo}/git/ref/{ref}',
    {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      ref: 'heads/main',
    }
  );

  const sha = reference.data.object.sha;

  // Creates new branch (from main, using main's sha) with the publisher's user id;
  await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
    owner: 'sine-fdn',
    repo: 'pact-catalog',
    ref: `refs/heads/@${publisherUserId}`,
    sha: `${sha}`,
  });

  // Creates empty index.js file to satisfy the NPM system requirements;
  await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: 'sine-fdn',
    repo: 'pact-catalog',
    path: `catalog/data-model-extensions/@${publisherUserId}/${packageName}/${version}/index.js`,
    message: 'Create empty index.js file',
    branch: `@${publisherUserId}`,
    content: '',
  });

  // Creates LICENSE file; TO DO: allow other licenses;
  await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: 'sine-fdn',
    repo: 'pact-catalog',
    path: `catalog/data-model-extensions/@${publisherUserId}/${packageName}/${version}/LICENSE`,
    message: 'Create LICENSE file',
    branch: `@${publisherUserId}`,
    content: Buffer.from(licenseText).toString('base64'),
  });

  // Creates object to pass as the content of the package.json file;
  const packageJsonContent: {} = {
    name: `@${publisherUserId}/${packageName}`,
    version: `${version}`,
    description: `${description}`,
    files: ['schema.json'],
    author: {
      name: `${publisherName}`,
      email: `${publisherEmail}`,
      url: `${publisherUrl}`,
    },
    license: 'MIT',
    catalog_info: {
      summary: `${summary}`,
      status: 'draft',
      authors: [`${publisherUserId}`],
    },
    industries,
  };

  await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: 'sine-fdn',
    repo: 'pact-catalog',
    path: `catalog/data-model-extensions/@${publisherUserId}/${packageName}/${version}/package.json`,
    message: 'Create package.json',
    branch: `@${publisherUserId}`,
    content: Buffer.from(JSON.stringify(packageJsonContent)).toString('base64'),
  });

  // Creates schema.json file with the submitted data;
  await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: 'sine-fdn',
    repo: 'pact-catalog',
    path: `catalog/data-model-extensions/@${publisherUserId}/${packageName}/${version}/schema.json`,
    message: 'Create schema.json',
    branch: `@${publisherUserId}`,
    content: Buffer.from(JSON.stringify(schemaJson)).toString('base64'),
  });

  // Creates README.md file with the submitted data;
  await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: 'sine-fdn',
    repo: 'pact-catalog',
    path: `catalog/data-model-extensions/@${publisherUserId}/${packageName}/${version}/documentation/README.md`,
    message: 'Create README.md',
    branch: `@${publisherUserId}`,
    content: Buffer.from(readme).toString('base64'),
  });

  // Opens Pull Request with the relevant files;
  const pullRequest = await octokit.request(
    'POST /repos/{owner}/{repo}/pulls',
    {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      title: `@${publisherUserId}/${packageName}`,
      body: `Creates Data Model Extension @${publisherUserId}/${packageName}, version ${version}`,
      head: `@${publisherUserId}`,
      base: 'main',
    }
  );

  const pullRequestNumber = pullRequest.data.number;

  // Adds automerge label to PR;
  await octokit.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/labels',
    {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      issue_number: pullRequestNumber,
      labels: ['automerge'],
    }
  );
}

const licenseText = `
MIT License

Copyright (c) 2022 <TBD>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
