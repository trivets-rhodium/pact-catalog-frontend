import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    publisherName,
    publisherUserId,
    publisherEmail,
    publisherUrl,
    packageName,
    version,
    summary,
    industries,
    description,
    schemaJson,
    readme,
  } = req.body;

  // Creates Octokit with access token passed as env variable;
  const octokit = new Octokit({
    auth: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
  });

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
  const licenseTextPath = path.join(process.cwd(), '/utils/MIT.txt');
  const licenseText = fs.readFileSync(licenseTextPath, 'utf-8').toString();
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

  res.status(200).json({ data: `${req.body}` });
}
