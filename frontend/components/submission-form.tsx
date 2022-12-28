import React from 'react';
import { useRouter } from 'next/router';
import { Octokit } from 'octokit';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import submitToGithub from '../utils/github-api';

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

    submitToGithub(formInput);

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
