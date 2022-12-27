import React from 'react';
import { FormEventHandler } from 'react';
import { useRouter } from 'next/router';
import { Octokit } from 'octokit';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

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

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFormInput({
      ...formInput,
      [name]: value,
    });
  }

  function handleTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFormInput({
      ...formInput,
      [name]: value,
    });
  }

  // const handleCodeMirrorChange = React.useCallback((value: string, _: any) => {
  //   console.log('formInput before', formInput)
  //   setFormInput({
  //     ...formInput,
  //     schemaJson: value,
  //   });
  //   console.log('formInput after', formInput);
  // }, []);

  function handleCodeMirrorChange(value: string) {
    setFormInput({
      ...formInput,
      schemaJson: value,
    });

    console.log('formInput', formInput);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      ref: `refs/heads/@${formInput.publisherUserId}`,
      sha: `${sha}`,
    });

    // Creates empty index.js file to satisfy the NPM system requirements;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${formInput.publisherUserId}/${formInput.packageName}/${formInput.version}/index.js`,
      message: 'Create empty index.js file',
      branch: `@${formInput.publisherUserId}`,
      content: btoa(''),
    });

    // Creates LICENSE file; TO DO: allow other licenses;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${formInput.publisherUserId}/${formInput.packageName}/${formInput.version}/LICENSE`,
      message: 'Create LICENSE file',
      branch: `@${formInput.publisherUserId}`,
      content: btoa(licenseText),
    });

    // Creates object to pass as the content of the package.json file;
    const packageJsonContent: {} = {
      name: `@${formInput.publisherUserId}/${formInput.packageName}`,
      version: `${formInput.version}`,
      description: `${formInput.description}`,
      files: ['schema.json'],
      author: {
        name: `${formInput.publisherName}`,
        email: `${formInput.publisherEmail}`,
        url: `${formInput.publisherUrl}`,
      },
      license: 'MIT',
      catalog_info: {
        summary: `${formInput.summary}`,
        status: 'draft',
        authors: [`${formInput.publisherUserId}`],
      },
    };

    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${formInput.publisherUserId}/${formInput.packageName}/${formInput.version}/package.json`,
      message: 'Create package.json',
      branch: `@${formInput.publisherUserId}`,
      content: btoa(JSON.stringify(packageJsonContent)),
    });

    // Creates schema.json file with the submitted data;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${formInput.publisherUserId}/${formInput.packageName}/${formInput.version}/schema.json`,
      message: 'Create schema.json',
      branch: `@${formInput.publisherUserId}`,
      content: btoa(JSON.stringify(formInput.schemaJson)),
    });

    // Creates README.md file with the submitted data;
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'sine-fdn',
      repo: 'pact-catalog',
      path: `catalog/data-model-extensions/@${formInput.publisherUserId}/${formInput.packageName}/${formInput.version}/documentation/README.md`,
      message: 'Create README.md',
      branch: `@${formInput.publisherUserId}`,
      content: btoa(formInput.readme),
    });

    // Opens Pull Request with the relevant files;
    const pullRequest = await octokit.request(
      'POST /repos/{owner}/{repo}/pulls',
      {
        owner: 'sine-fdn',
        repo: 'pact-catalog',
        title: `@${formInput.publisherUserId}/${formInput.packageName}`,
        body: `Creates Data Model Extension @${formInput.publisherUserId}/${formInput.packageName}, version ${formInput.version}`,
        head: `@${formInput.publisherUserId}`,
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
          onChange={handleInputChange}
        />

        <label htmlFor="publisherUserId">Publisher User Id</label>
        <input
          type="text"
          id="publisherUserId"
          name="publisherUserId"
          className="mt-2 mb-6 rounded-sm p-2"
          required
          onChange={handleInputChange}
        />

        <label htmlFor="publisherEmail">Publisher Email</label>
        <input
          type="text"
          id="publisherEmail"
          name="publisherEmail"
          className="mt-2 mb-6 rounded-sm p-2"
          required
          onChange={handleInputChange}
        />

        <label htmlFor="publisherUrl">Publisher Website</label>
        <input
          type="text"
          id="publisherUrl"
          name="publisherUrl"
          className="mt-2 mb-6 rounded-sm p-2"
          required
          onChange={handleInputChange}
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
          onChange={handleInputChange}
        />

        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          className="mt-2 mb-6 rounded-sm p-2"
          required
          onChange={handleInputChange}
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
          onChange={handleInputChange}
        />

        <label htmlFor="summary">Summary (optional)</label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={5}
          className="mt-2 mb-6 rounded-sm p-2"
          onChange={handleTextAreaChange}
        />

        <label htmlFor="schemaJson">schema.json Content</label>
        {/* <textarea
          id="schemaJson"
          name="schemaJson"
          required
          rows={10}
          className="mt-2 mb-6 rounded-sm p-2"
          onChange={handleTextAreaChange}
        /> */}
        <CodeMirror
          className="mt-2 mb-6 p-2"
          height="200px"
          extensions={[json()]}
          onChange={handleCodeMirrorChange}
        />

        <label htmlFor="readme">README.md Content</label>
        <textarea
          id="readme"
          name="readme"
          required
          rows={10}
          className="mt-2 mb-6 rounded-sm p-2"
          onChange={handleTextAreaChange}
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
