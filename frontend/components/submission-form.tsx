import React from 'react';
import { useRouter } from 'next/router';
import { Octokit } from 'octokit';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';

export default function SubmissionForm() {
  const router = useRouter();

  const [formInput, setFormInput] = React.useState({
    publisherName: '',
    publisherUserId: '',
    publisherEmail: '',
    publisherUrl: '',
    packageName: '',
    description: '',
    version: '',
    summary: '',
    schemaJson: '',
    readme: '',
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFormInput({
      ...formInput,
      [name]: value,
    });
  }

  function handleCodeMirrorChangeSchemaJson(value: string) {
    setFormInput({
      ...formInput,
      schemaJson: value,
    });
  }

  function handleCodeMirrorChangeReadme(value: string) {
    setFormInput({
      ...formInput,
      readme: value,
    });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {
      publisherName,
      publisherUserId,
      publisherEmail,
      publisherUrl,
      packageName,
      description,
      version,
      summary,
      schemaJson,
      readme,
    } = formInput;

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
        // TO DO: Replace 'new-submission-form' with 'main' again.
        ref: 'heads/new-submission-form',
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
      content: btoa(''),
    });

    // Creates LICENSE file; TO DO: allow other licenses;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${publisherUserId}/${packageName}/${version}/LICENSE`,
      message: 'Create LICENSE file',
      branch: `@${publisherUserId}`,
      content: btoa(licenseText),
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
    };

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${publisherUserId}/${packageName}/${version}/package.json`,
      message: 'Create package.json',
      branch: `@${publisherUserId}`,
      content: btoa(JSON.stringify(packageJsonContent)),
    });

    // Creates schema.json file with the submitted data;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${publisherUserId}/${packageName}/${version}/schema.json`,
      message: 'Create schema.json',
      branch: `@${publisherUserId}`,
      content: btoa(JSON.stringify(schemaJson)),
    });

    // Creates README.md file with the submitted data;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${publisherUserId}/${packageName}/${version}/documentation/README.md`,
      message: 'Create README.md',
      branch: `@${publisherUserId}`,
      content: btoa(readme),
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
        // TO DO: Replace 'new-submission-form' with 'main' again
        base: 'new-submission-form',
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

    alert('Your extension was successfully submited, thank you!');
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label htmlFor="publisherName">Publisher Name</label>
        <input
          type="text"
          id="publisherName"
          name="publisherName"
          className="mt-2 mb-6 rounded-sm p-2"
          required
          onChange={handleChange}
        />

        <label htmlFor="publisherUserId">Publisher User Id</label>
        <input
          type="text"
          id="publisherUserId"
          name="publisherUserId"
          className="mt-2 mb-6 rounded-sm p-2"
          required
          onChange={handleChange}
        />

        <label htmlFor="publisherEmail">Publisher Email</label>
        <input
          type="text"
          id="publisherEmail"
          name="publisherEmail"
          className="mt-2 mb-6 rounded-sm p-2"
          required
          onChange={handleChange}
        />

        <label htmlFor="publisherUrl">Publisher Website</label>
        <input
          type="text"
          id="publisherUrl"
          name="publisherUrl"
          className="mt-2 mb-6 rounded-sm p-2"
          required
          onChange={handleChange}
        />

        {/* TO DO: Possibility of adding contributors */}

        <label htmlFor="packageName">Package Name</label>
        <input
          type="text"
          id="packageName"
          name="packageName"
          pattern="[^\s]+"
          className="mt-2 mb-6 rounded-sm p-2"
          required
          onChange={handleChange}
        />

        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          className="mt-2 mb-6 rounded-sm p-2"
          required
          onChange={handleChange}
        />

        {/* <label>Industry</label>
        <input
          list="industry"
          name="industry"
          required
          className="mt-2 mb-6 rounded-sm p-2"
        />
        <datalist id="industry">
          <option value="Steel" />
          <option value="Another Industry" />
          <option value="Products" />
        </datalist> */}

        {/* <label>Status</label>
        <input
          list="status"
          name="status"
          required
          className="mt-2 mb-6 rounded-sm p-2"
        />
        <datalist id="status" defaultValue={'Draft'}>
          <option value="Draft" />
          <option value="Published" disabled />
          <option value="Deprecated" disabled />
        </datalist> */}

        <label htmlFor="version">Version</label>
        <input
          type="text"
          id="version"
          name="version"
          pattern="^(\d+\.){2}\d+$"
          className="mt-2 mb-6 rounded-sm p-2"
          required
          onChange={handleChange}
        />

        <label htmlFor="summary">Summary (optional)</label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={5}
          className="mt-2 mb-6 rounded-sm p-2"
          onChange={handleChange}
        />

        <label htmlFor="schemaJson">schema.json Content</label>
        <CodeMirror
          className="mt-2 mb-6"
          minHeight="200px"
          extensions={[json()]}
          onChange={handleCodeMirrorChangeSchemaJson}
        />

        <label htmlFor="readme">README.md Content</label>
        <CodeMirror
          className="mt-2 mb-6"
          minHeight="200px"
          extensions={[markdown()]}
          onChange={handleCodeMirrorChangeReadme}
        />

        <input type="submit" value="Submit" className="primary-button" />
      </div>
    </form>
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
