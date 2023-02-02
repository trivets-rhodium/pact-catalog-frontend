import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { createOAuthUserAuth } from '@octokit/auth-oauth-user';
// import { Octokit } from '@octokit/rest';
import { OAuthApp, createNodeMiddleware } from '@octokit/oauth-app';
import { Octokit } from 'octokit';
import { getToken } from 'next-auth/jwt';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { PackageJsonParser } from '../../lib/catalog-types.schema';

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

  const token = await getToken({ req });
  const session = await unstable_getServerSession(req, res, authOptions);

  const zodValidation = PackageJsonParser.parse(req.body)

  // TO DO: Decide whether this logic is needed. The goal was to have as many layers of
  // authorization as possible, but this is throwing a 500 error:  Error: Cannot find module
  // './lib/validateAsymmetricKey'
  if (!session) {
    res.status(401);
  } else if (!zodValidation) {
    res.status(401);
  } else {
    // WORKING BUT SUBOPTIMAL:
    // const octokit = new Octokit({
    //   auth: process.env.ACCESS_TOKEN,
    // });

    // NOT WORKING:
    // const octokit = new Octokit({
    //   authStrategy: createOAuthUserAuth,
    //   auth: {
    //     clientId: process.env.CLIENT_ID,
    //     clientSecret: process.env.CLIENT_SECRET,
    //     code,
    //   },
    // });

    // Kept from documentation for testing purposes:
    // Exchanges the code for the user access token authentication on first request
    // and caches the authentication for successive requests
    // const {
    //   data: { login: login1 },
    // } = await octokit.request('GET /user');
    // console.log('1: Hello, %s!', login1);

    //WORKING:
    // const app = new OAuthApp({
    //   clientType: 'oauth-app',
    //   clientId: process.env.CLIENT_ID as string,
    //   clientSecret: process.env.CLIENT_SECRET as string,
    //   defaultScopes: ['repo'],
    // });

    // const octokit = await app.getUserOctokit({ code });

    // const token = await app.createToken({
    //   code,
    // });

    const octokit = new Octokit({
      auth: token?.accessToken,
    });

    // const {
    //   data: { login, name, email },
    // } = await octokit.request('GET /user');
    // console.log('Hello, %s!', login);

    // const {
    //   data: {
    //     ref,
    //     object: { sha },
    //   },
    // } = await octokit.rest.git.getRef({
    //   owner: 'sine-fdn',
    //   repo: 'pact-catalog',
    //   ref: 'heads/main',
    // });

    const ref = await octokit.request(
      'GET /repos/{owner}/{repo}/git/matching-refs/{ref}',
      {
        owner: 'sine-fdn',
        repo: 'pact-catalog',
        ref: 'heads/main',
      }
    );

    const sha = ref.data[0].object.sha;

    console.log('ref.data[0].object.sha', ref.data[0].object.sha);

    await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      ref: `refs/heads/@${publisherUserId}`,
      sha,
    });

    // Creates new branch (from main, using main's sha) with the publisher's user id;
    // await octokit.rest.git.createRef({
    //   owner: 'sine-fdn',
    //   repo: 'pact-catalog',
    //   ref: `refs/heads/@${publisherUserId}`,
    //   sha,
    // });

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
      content: Buffer.from(
        JSON.stringify(packageJsonContent, null, 2)
      ).toString('base64'),
    });

    // Creates schema.json file with the submitted data;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${publisherUserId}/${packageName}/${version}/schema.json`,
      message: 'Create schema.json',
      branch: `@${publisherUserId}`,
      content: Buffer.from(
        JSON.stringify(schemaJson)
          .replace(/\\n/g, '\n')
          .replace(/^"/, '')
          .replace(/"$/, '')
          .replace(/\\/g, '')
      ).toString('base64'),
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
}
