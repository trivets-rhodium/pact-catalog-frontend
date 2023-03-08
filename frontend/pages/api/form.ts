import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { createOAuthUserAuth } from '@octokit/auth-oauth-user';
// import { Octokit } from '@octokit/rest';
// import { OAuthApp, createNodeMiddleware } from '@octokit/oauth-app';
import { App, createNodeMiddleware } from '@octokit/app';
import { Octokit } from 'octokit';
import { getToken } from 'next-auth/jwt';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import {
  PackageJsonParser,
  validateSchemaJson,
} from '../../lib/catalog-types.schema';
import { getServerSession } from 'next-auth/next';

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
    code,
  } = req.body;

  const session = await getServerSession(req, res, authOptions);

  console.log('session', session);
  console.error('session', session);

  const zodReadyJson = {
    name: `@${session.user.login}/${packageName}`,
    version,
    description,
    files: ['schema.json'],
    author: {
      name: publisherName,
      email: publisherEmail,
      url: publisherUrl,
    },
    license: 'MIT',
    catalog_info: {
      summary,
      status: 'draft',
      authors: [session.user.login],
    },
    industries,
  };

  const packageValidation = PackageJsonParser.parse(zodReadyJson);
  const schemaJsonValidation = validateSchemaJson(schemaJson);

  if (!session || !packageValidation || !schemaJsonValidation) {
    return res.status(401);
  } else {
    const app = new App({
      appId: parseInt(process.env.GITHUB_APP_ID as string),
      privateKey: process.env.GITHUB_APP_PRIVATE_KEY as string,
      webhooks: {
        secret: process.env.WEBHOOK_SECRET as string,
      },
    });

    const octokit = await app.getInstallationOctokit(
      parseInt(process.env.GITHUB_APP_INSTALLATION_ID as string)
    );

    const ref = await octokit.request(
      'GET /repos/{owner}/{repo}/git/matching-refs/{ref}',
      {
        owner: 'sine-fdn',
        repo: 'pact-catalog',
        ref: 'heads/main',
      }
    );

    const sha = ref.data[0].object.sha;

    // Creates new branch
    await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      ref: `refs/heads/@${session.user.login}/${packageName}/${version}`,
      sha,
    });

    // Creates empty index.js file to satisfy the NPM system requirements;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${session.user.login}/${packageName}/${version}/index.js`,
      message: 'Create empty index.js file',
      branch: `@${session.user.login}`,
      content: '',
    });

    // Creates LICENSE file; TO DO: allow other licenses;
    const licenseTextPath = path.join(process.cwd(), '/utils/MIT.txt');
    const licenseText = fs.readFileSync(licenseTextPath, 'utf-8').toString();
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${session.user.login}/${packageName}/${version}/LICENSE`,
      message: 'Create LICENSE file',
      branch: `@${session.user.login}`,
      content: Buffer.from(licenseText).toString('base64'),
    });

    // Creates object to pass as the content of the package.json file;
    const packageJsonContent: {} = {
      name: `@${session.user.login}/${packageName}`,
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
        authors: [`${session.user.login}`],
      },
      industries,
    };

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${session.user.login}/${packageName}/${version}/package.json`,
      message: 'Create package.json',
      branch: `@${session.user.login}`,
      content: Buffer.from(
        JSON.stringify(packageJsonContent, null, 2)
      ).toString('base64'),
    });

    // Creates schema.json file with the submitted data;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${session.user.login}/${packageName}/${version}/schema.json`,
      message: 'Create schema.json',
      branch: `@${session.user.login}`,
      content: Buffer.from(schemaJson).toString('base64'),
    });

    // Creates README.md file with the submitted data;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${session.user.login}/${packageName}/${version}/documentation/README.md`,
      message: 'Create README.md',
      branch: `@${session.user.login}`,
      content: Buffer.from(readme).toString('base64'),
    });

    // Opens Pull Request with the relevant files;
    const pullRequest = await octokit.request(
      'POST /repos/{owner}/{repo}/pulls',
      {
        owner: 'sine-fdn',
        repo: 'pact-catalog',
        title: `@${session.user.login}/${packageName}`,
        body: `Creates Data Model Extension @${session.user.login}/${packageName}, version ${version}`,
        head: `@${session.user.login}`,
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
}