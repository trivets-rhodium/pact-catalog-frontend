import { useRouter } from 'next/router';
import { Octokit } from 'octokit';
import Layout from '../components/layout';
import SubmissionForm from '../components/submission-form';

export default function newSubmission() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      publisherName: { value: string };
      publisherUserId: { value: string };
      publisherEmail: { value: string };
      publisherUrl: { value: string };
      packageName: { value: string };
      description: { value: string };
      version: { value: string };
      summary: { value: string };
      schemaJson: { value: string };
      readme: { value: string };
    };

    // Creates Octokit with access token passed as env variable;
    const octokit = new Octokit({
      auth: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
    });

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
      ref: `refs/heads/@${target.publisherUserId.value}`,
      sha: `${sha}`,
    });

    // Creates empty index.js file to satisfy the NPM system requirements;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${target.publisherUserId.value}/${target.packageName.value}/${target.version.value}/index.js`,
      message: 'Create empty index.js file',
      branch: `@${target.publisherUserId.value}`,
      content: btoa(''),
    });

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

    // Creates LICENSE file; TO DO: allow other licenses;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${target.publisherUserId.value}/${target.packageName.value}/${target.version.value}/LICENSE`,
      message: 'Create LICENSE file',
      branch: `@${target.publisherUserId.value}`,
      content: btoa(licenseText),
    });

    // Creates object to pass as the content of the package.json file;
    const packageJsonContent: {} = {
      name: `@${target.publisherUserId.value}/${target.packageName.value}`,
      version: `${target.version.value}`,
      description: `${target.description.value}`,
      files: ['schema.json'],
      author: {
        name: `${target.publisherName.value}`,
        email: `${target.publisherEmail.value}`,
        url: `${target.publisherUrl.value}`,
      },
      license: 'MIT',
      catalog_info: {
        summary: `${target.summary.value}`,
        status: 'draft',
        authors: [`${target.publisherUserId.value}`],
      },
    };

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${target.publisherUserId.value}/${target.packageName.value}/${target.version.value}/package.json`,
      message: 'Create package.json',
      branch: `@${target.publisherUserId.value}`,
      content: btoa(JSON.stringify(packageJsonContent)),
    });

    // Creates schema.json file with the submitted data;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${target.publisherUserId.value}/${target.packageName.value}/${target.version.value}/schema.json`,
      message: 'Create schema.json',
      branch: `@${target.publisherUserId.value}`,
      content: btoa(JSON.stringify(target.schemaJson.value)),
    });

    // Creates README.md file with the submitted data;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${target.publisherUserId.value}/${target.packageName.value}/${target.version.value}/documentation/README.md`,
      message: 'Create README.md',
      branch: `@${target.publisherUserId.value}`,
      content: btoa(target.readme.value),
    });

    // Opens Pull Request with the relevant files;
    await octokit.request('POST /repos/{owner}/{repo}/pulls', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      title: `@${target.publisherUserId.value}/${target.packageName.value}`,
      body: `Creates Data Model Extension @${target.publisherUserId.value}/${target.packageName.value}, version ${target.version.value}`,
      head: `@${target.publisherUserId.value}`,
      base: 'main',
    });

    alert("Your extension was successfully submited, thank you!")
    router.push('/');
  };

  return (
    <Layout title="New Submission">
      <SubmissionForm submitHandler={handleSubmit} />
    </Layout>
  );
}
