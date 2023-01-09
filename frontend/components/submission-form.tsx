import React, { FormEvent } from 'react';
import { useRouter } from 'next/router';
import { Octokit } from 'octokit';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView, ViewUpdate } from '@codemirror/view';

import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import submitToGithub from '../utils/github-api';
import { getUser } from '../lib/users';
import { CatalogUser } from '../lib/catalog-types';

export default function SubmissionForm() {
  const router = useRouter();

  const [formInput, setFormInput] = React.useState({
    publisherName: '',
    publisherUserId: '',
    publisherEmail: '',
    publisherUrl: '',
    packageName: '',
    industry: '',
    description: '',
    version: '',
    summary: '',
    schemaJson: '',
    readme: '',
  });

  async function handleChange(
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

  function handleChangeToLowerCase(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    const value = event.target.value.toLocaleLowerCase();

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    submitToGithub(formInput);

    alert('Your extension was successfully submited, thank you!');
    router.push('/');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col px-40">
      <label htmlFor="publisherName">Publisher Name</label>
      <input
        type="text"
        id="publisherName"
        name="publisherName"
        className="mt-2 mb-6 rounded-sm p-2"
        required
        onInvalid={(event: React.ChangeEvent<HTMLInputElement>) =>
          event.target.setCustomValidity('Please chose a publisher name')
        }
        onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
          event.target.setCustomValidity('')
        }
        onChange={handleChange}
      />

      <label htmlFor="publisherUserId">Publisher User Id</label>
      <input
        type="text"
        id="publisherUserId"
        name="publisherUserId"
        className="mt-2 mb-6 rounded-sm p-2"
        required
        onChange={handleChangeToLowerCase}
        pattern="\S+"
        onInvalid={(event: React.ChangeEvent<HTMLInputElement>) =>
          event.target.setCustomValidity('Please do not use whitespaces')
        }
        onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
          event.target.setCustomValidity('')
        }
      />

      <label htmlFor="publisherEmail">Publisher Email</label>
      <input
        type="email"
        name="publisherEmail"
        className="mt-2 mb-6 rounded-sm p-2"
        required
        onChange={handleChange}
      />

      <label htmlFor="publisherUrl">Publisher Website</label>
      <input
        type="url"
        name="publisherUrl"
        className="mt-2 mb-6 rounded-sm p-2"
        required
        onChange={handleChange}
      />

      {/* TO DO: possibility of adding contributors? With userID? Or by manually adding their e-mails, etc.? */}

      <label htmlFor="packageName">Package Name</label>
      <input
        type="text"
        name="packageName"
        className="mt-2 mb-6 rounded-sm p-2"
        required
        onChange={handleChangeToLowerCase}
        pattern="\S+"
        onInvalid={(event: React.ChangeEvent<HTMLInputElement>) =>
          event.target.setCustomValidity('Please do not use whitespaces')
        }
        onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
          event.target.setCustomValidity('')
        }
      />

      <label htmlFor="description">Description</label>
      <input
        type="text"
        name="description"
        className="mt-2 mb-6 rounded-sm p-2"
        required
        onChange={handleChange}
      />

      <label htmlFor="industry">Industries</label>
      <input
        type="text"
        name="industry"
        className="mt-2 mb-6 rounded-sm p-2"
        required
        onChange={handleChange}
      />

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
        name="version"
        pattern="^(\d+\.){2}\d+$"
        className="mt-2 mb-6 rounded-sm p-2"
        required
        onChange={handleChange}
        onInvalid={(event: React.ChangeEvent<HTMLInputElement>) =>
          event.target.setCustomValidity(
            'Please use the X.Y.Z format, where X, Y and Z are non-negative integers'
          )
        }
      />

      <label htmlFor="summary">Summary (optional)</label>
      <textarea
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

      <div>
        <label htmlFor="readme">README.md Content</label>
        <CodeMirror
          className="mt-2 mb-6"
          minHeight="200px"
          extensions={[markdown()]}
          onChange={handleCodeMirrorChangeReadme}
        />
      </div>

      <input type="submit" value="Submit" className="primary-button" />
    </form>
  );
}
