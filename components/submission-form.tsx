import React, { useCallback, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { useSession } from 'next-auth/react';
import { DefaultSession, ISODateString } from 'next-auth';
import { PackageJsonParser } from '../lib/catalog-types.schema';
import { useRouter } from 'next/router';
import { validateSchemaJson } from '../lib/catalog-types.schema';

export default function SubmissionForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = React.useState(false);

  const [formInput, setFormInput] = React.useState({
    publisherName: '',
    publisherUserId: '',
    publisherEmail: '',
    publisherUrl: '',
    packageName: '',
    description: '',
    industries: [''],
    version: '',
    summary: '',
    schemaJson: '',
    readme: '',
  });

  useEffect(() => {
    let input = { ...formInput };

    if (session?.user?.name) {
      input.publisherName = session.user.name;
    }
    if (session?.user && session.user.login) {
      input.publisherUserId = session.user.login;
    }
    if (session?.user?.email) {
      input.publisherEmail = session.user.email;
    }
    if (session?.user?.blog) {
      input.publisherUrl = session.user.blog;
    }

    setFormInput(input);
  }, [session]);

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

  function handleIndustriesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const industries = event.target.value.split(',');
    const value = industries.map((industry) => {
      return industry.trim();
    });

    setFormInput({
      ...formInput,
      industries: value,
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

    setSubmitting(true);

    if (!validateSchemaJson(formInput.schemaJson)) {
      setSubmitting(false);
      return;
    }

    const JSONdata = JSON.stringify(formInput);

    const endpoint = 'api/form';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata,
    };

    await fetch(endpoint, options).then((response) => {
      if (response.status === 200) {
        alert(`Thank you, your extension was successfully submitted`);
        router.push('/');
      } else {
        alert('Please try again');
      }
      setSubmitting(false);
    });
  }

  const onBlurValidate = useCallback(
    (_event: React.FocusEvent<HTMLDivElement, Element>) => {
      validateSchemaJson(formInput.schemaJson);
    },
    [formInput]
  );

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
        value={formInput.publisherName}
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
        value={formInput.publisherUserId}
      />

      <label htmlFor="publisherEmail">Publisher Email</label>
      <input
        type="email"
        name="publisherEmail"
        className="mt-2 mb-6 rounded-sm p-2"
        required
        onChange={handleChange}
        value={formInput.publisherEmail}
      />

      <label htmlFor="publisherUrl">Publisher Website</label>
      <input
        type="url"
        name="publisherUrl"
        className="mt-2 mb-6 rounded-sm p-2"
        required
        onChange={handleChange}
        value={formInput.publisherUrl}
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
        value={formInput.packageName}
      />

      <label htmlFor="description">Description</label>
      <input
        type="text"
        name="description"
        className="mt-2 mb-6 rounded-sm p-2"
        required
        onChange={handleChange}
        value={formInput.description}
      />

      <label htmlFor="industries">Industries</label>
      <input
        type="text"
        name="industries"
        className="mt-2 mb-6 rounded-sm p-2"
        onChange={handleIndustriesChange}
        pattern="\w+(,\s*\w+)*"
        required
        onInvalid={(event: React.ChangeEvent<HTMLInputElement>) =>
          event.target.setCustomValidity(
            'Please write industry names separated by commas'
          )
        }
        onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
          event.target.setCustomValidity('')
        }
        value={formInput.industries}
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
        onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
          event.target.setCustomValidity('')
        }
        value={formInput.version}
      />

      <label htmlFor="summary">Summary (optional)</label>
      <textarea
        name="summary"
        rows={5}
        className="mt-2 mb-6 rounded-sm p-2"
        onChange={handleChange}
        value={formInput.summary}
      />

      <label htmlFor="schemaJson">schema.json Content</label>
      <CodeMirror
        className="mt-2 mb-6"
        minHeight="200px"
        extensions={[json()]}
        onChange={handleCodeMirrorChangeSchemaJson}
        onBlur={onBlurValidate}
        value={formInput.schemaJson}
      />

      <div>
        <label htmlFor="readme">README.md Content</label>
        <CodeMirror
          className="mt-2 mb-6"
          minHeight="200px"
          extensions={[markdown()]}
          onChange={handleCodeMirrorChangeReadme}
          value={formInput.readme}
        />
      </div>

      <input
        type="submit"
        value={submitting ? 'Loading...' : 'Submit'}
        className={submitting ? 'primary-button-loading' : 'primary-button'}
      />
    </form>
  );
}
