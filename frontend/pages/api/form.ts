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
import { RequestError } from '@octokit/request-error';
import { ZodError } from 'zod';

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

  const schemaJsonValidation = validateSchemaJson(schemaJson);

  if (!session) {
    return res.status(401).json({
      error: 'no_session',
      message: 'You are not logged in to GitHub. Please log in and try again.',
    });
  } else if (!schemaJsonValidation.validSchemaJson) {
    return res
      .status(400)
      .json({ error: 'invalid_schem_json', message: 'Invalid schema.json' });
  } else {
    try {
      PackageJsonParser.parse(zodReadyJson);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'invalid_package_json',
          message: `Invalid package.json. Please correct the following fields: ${
            JSON.parse(error.message)[0].path
          }`,
        });
      }
    }

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

    const [owner, repo] = process.env.CATALOG_REPO
      ? process.env.CATALOG_REPO.split('/')
      : ['sine-fdn', 'pact-catalog-frontend'];

    const ref = await octokit.request(
      'GET /repos/{owner}/{repo}/git/matching-refs/{ref}',
      {
        owner,
        repo,
        ref: 'heads/main',
      }
    );

    const sha = ref.data[0].object.sha;

    // Creates new branch
    try {
      await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
        owner,
        repo,
        ref: `refs/heads/@${session.user.login}/${packageName}/${version}`,
        sha,
      });
    } catch (error) {
      if (error instanceof RequestError) {
        return res.status(error.status).json(error.response);
      }
    }

    // Creates empty index.js file to satisfy the NPM system requirements;
    try {
      await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: `catalog/data-model-extensions/@${session.user.login}/${packageName}/${version}/index.js`,
        message: 'Create empty index.js file',
        branch: `@${session.user.login}/${packageName}/${version}`,
        content: '',
      });
    } catch (error) {
      if (error instanceof RequestError) {
        return res.status(error.status).json(error.response);
      }
    }

    // Creates LICENSE file; TO DO: allow other licenses;
    try {
      const licenseTextPath = path.join(process.cwd(), '/utils/MIT.txt');
      const licenseText = fs.readFileSync(licenseTextPath, 'utf-8').toString();
      await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: `catalog/data-model-extensions/@${session.user.login}/${packageName}/${version}/LICENSE`,
        message: 'Create LICENSE file',
        branch: `@${session.user.login}/${packageName}/${version}`,
        content: Buffer.from(licenseText).toString('base64'),
      });
    } catch (error) {
      if (error instanceof RequestError) {
        return res.status(error.status).json(error.response);
      }
    }

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

    try {
      await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: `catalog/data-model-extensions/@${session.user.login}/${packageName}/${version}/package.json`,
        message: 'Create package.json',
        branch: `@${session.user.login}/${packageName}/${version}`,
        content: Buffer.from(
          JSON.stringify(packageJsonContent, null, 2)
        ).toString('base64'),
      });
    } catch (error) {
      if (error instanceof RequestError) {
        return res.status(error.status).json(error.response);
      }
    }

    // Creates schema.json file with the submitted data;
    try {
      await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: `catalog/data-model-extensions/@${session.user.login}/${packageName}/${version}/schema.json`,
        message: 'Create schema.json',
        branch: `@${session.user.login}/${packageName}/${version}`,
        content: Buffer.from(schemaJson).toString('base64'),
      });
    } catch (error) {
      if (error instanceof RequestError) {
        return res.status(error.status).json(error.response);
      }
    }

    // Creates README.md file with the submitted data;
    try {
      await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: `catalog/data-model-extensions/@${session.user.login}/${packageName}/${version}/documentation/README.md`,
        message: 'Create README.md',
        branch: `@${session.user.login}/${packageName}/${version}`,
        content: Buffer.from(readme).toString('base64'),
      });
    } catch (error) {
      if (error instanceof RequestError) {
        return res.status(error.status).json(error.response);
      }
    }

    // Opens Pull Request with the relevant files;
    try {
      const pullRequest = await octokit.request(
        'POST /repos/{owner}/{repo}/pulls',
        {
          owner,
          repo,
          title: `@${session.user.login}/${packageName}`,
          body: `Creates Data Model Extension @${session.user.login}/${packageName}, version ${version}`,
          head: `@${session.user.login}/${packageName}/${version}`,
          base: 'main',
        }
      );

      const pullRequestNumber = pullRequest.data.number;

      // Adds automerge label to PR;
      await octokit.request(
        'POST /repos/{owner}/{repo}/issues/{issue_number}/labels',
        {
          owner,
          repo,
          issue_number: pullRequestNumber,
          labels: ['automerge'],
        }
      );
    } catch (error) {
      if (error instanceof RequestError) {
        return res.status(error.status).json(error.response);
      }
    }

    res.status(200).json({
      message: `Thank you! Your extension was successfully submitted.`,
    });
  }
}
