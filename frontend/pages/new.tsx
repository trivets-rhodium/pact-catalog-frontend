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

    const data = {
      publisherName: target.publisherName.value,
      publisherUserId: target.publisherUserId.value,
      publisherEmail: target.publisherEmail.value,
      publisherUrl: target.publisherUrl.value,
      packageName: target.packageName.value,
      description: target.description.value,
      version: target.version.value,
      summary: target.summary.value,
      schemaJson: target.schemaJson.value,
      readme: target.readme.value,
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
      ref: `refs/heads/@${data.publisherUserId}`,
      sha: `${sha}`,
    });

    // Creates empty index.js file to satisfy the NPM system requirements;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${data.publisherUserId}/${data.packageName}/${data.version}/index.js`,
      message: 'Create empty index.js file',
      branch: `@${data.publisherUserId}`,
      content: btoa(''),
    });

    const licenseText = `MIT License

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
      path: `catalog/data-model-extensions/@${data.publisherUserId}/${data.packageName}/${data.version}/LICENSE`,
      message: 'Create LICENSE file',
      branch: `@${data.publisherUserId}`,
      content: btoa(licenseText),
    });

    // Creates object to pass as the content of the package.json file;
    const packageJsonContent: {} = {
      name: `@${data.publisherUserId}/${data.packageName}`,
      version: `${data.version}`,
      description: `${data.description}`,
      files: ['schema.json'],
      author: {
        name: `${data.publisherName}`,
        email: `${data.publisherEmail}`,
        url: `${data.publisherUrl}`,
      },
      license: 'MIT',
      catalog_info: {
        summary: `${data.summary}`,
        status: 'draft',
        authors: [`${data.publisherUserId}`],
      },
    };

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${data.publisherUserId}/${data.packageName}/${data.version}/package.json`,
      message: 'Create package.json',
      branch: `@${data.publisherUserId}`,
      content: btoa(JSON.stringify(packageJsonContent)),
    });

    // Creates schema.json file with the submitted data;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${data.publisherUserId}/${data.packageName}/${data.version}/schema.json`,
      message: 'Create schema.json',
      branch: `@${data.publisherUserId}`,
      content: btoa(JSON.stringify(data.schemaJson)),
    });

    // Creates README.md file with the submitted data;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${data.publisherUserId}/${data.packageName}/${data.version}/documentation/README.md`,
      message: 'Create README.md',
      branch: `@${data.publisherUserId}`,
      content: btoa(data.readme),
    });

    // Opens Pull Request with the relevant files;
    await octokit.request('POST /repos/{owner}/{repo}/pulls', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      title: `@${data.publisherUserId}/${data.packageName}`,
      body: `Creates Data Model Extension @${data.publisherUserId}/${data.packageName}, version ${data.version}`,
      head: `@${data.publisherUserId}`,
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
