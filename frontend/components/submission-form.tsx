import React, { useCallback, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { useSession } from 'next-auth/react';
import { DefaultSession, ISODateString } from 'next-auth';
import { PackageJsonParser } from '../lib/catalog-types.schema';
import { useRouter } from 'next/router';
import { validateSchemaJson } from '../lib/catalog-types.schema';
import Link from 'next/link';

export default function SubmissionForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = React.useState(false);

  let packageName = '';
  let description = '';
  let industries = [''];
  let version = '';
  let schemaJson = '';

  console.log(process.env.NEXT_PUBLIC_DEV);

  if (process.env.NEXT_PUBLIC_DEV) {
    packageName = 'test';
    description = 'test';
    industries = ['test'];
    version = '0.0.0';
    schemaJson = JSON.stringify(
      {
        $id: 'https://pact-catalog/schemas/@wbcsd-product-footprint-2.0.0.schema.json',
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        title: 'WBCSD Product Footprint Extension',
        type: 'object',
        properties: {
          propertyOne: {
            type: 'string',
            description: 'The description of the first property.',
          },
          propertyTwo: {
            type: 'string',
            description: 'The description of the second property.',
          },
          propertyThree: {
            description: 'The description of the third property.',
            type: 'integer',
            minimum: 0,
          },
        },
      },
      null,
      2
    );
  }

  const [formInput, setFormInput] = React.useState({
    publisherName: '',
    publisherUserId: '',
    publisherEmail: '',
    publisherUrl: '',
    packageName,
    description,
    industries,
    version,
    summary: '',
    schemaJson,
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);

    const parsedSchemaJson = validateSchemaJson(formInput.schemaJson);

    if (!parsedSchemaJson.validSchemaJson) {
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

    fetch(endpoint, options).then((res) => {
      res.json().then((data) => {
        console.log('Response', res);
        if (res.status === 422) {
          alert(
            `Communication with GitHub was unsuccessful: ${data.data.message}`
          );
        } else if (res.status === 200) {
          alert(data.message);
          router.push('/extensions');
        } else {
          alert(data.message);
        }

        setSubmitting(false);
      });
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
      <label htmlFor="publisherUserId">Publisher User Id</label>
      <input
        type="text"
        id="publisherUserId"
        name="publisherUserId"
        className="mt-2 mb-6 rounded-sm bg-white p-2 drop-shadow opacity-50"
        readOnly
        value={formInput.publisherUserId}
        disabled
      />

      <label htmlFor="publisherName">Publisher Name</label>
      <input
        type="text"
        id="publisherName"
        name="publisherName"
        className="mt-2 mb-6 rounded-sm bg-white p-2 drop-shadow"
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

      <label htmlFor="publisherEmail">Publisher Email</label>
      <input
        type="email"
        name="publisherEmail"
        className="mt-2 mb-6 rounded-sm bg-white p-2 drop-shadow"
        required
        onChange={handleChange}
        value={formInput.publisherEmail}
      />

      <label htmlFor="publisherUrl">Publisher Website</label>
      <input
        type="url"
        name="publisherUrl"
        className="mt-2 mb-6 rounded-sm bg-white p-2 drop-shadow"
        required
        onChange={handleChange}
        value={formInput.publisherUrl}
      />

      {/* TO DO: possibility of adding contributors? With userID? Or by manually adding their e-mails, etc.? */}

      <label htmlFor="packageName">Package Name</label>
      <input
        type="text"
        name="packageName"
        className="mt-2 mb-6 rounded-sm bg-white p-2 drop-shadow"
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
        className="mt-2 mb-6 rounded-sm bg-white p-2 drop-shadow"
        required
        onChange={handleChange}
        value={formInput.description}
      />

      <label htmlFor="industries">Industries</label>
      <input
        type="text"
        name="industries"
        className="mt-2 mb-6 rounded-sm bg-white p-2 drop-shadow"
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
          className="mt-2 mb-6 rounded-sm bg-white p-2 drop-shadow"
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
        className="mt-2 mb-6 rounded-sm bg-white p-2 drop-shadow"
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
        className="mt-2 mb-6 rounded-sm bg-white p-2 drop-shadow"
        onChange={handleChange}
        value={formInput.summary}
      />

      <label htmlFor="schemaJson">
        schema.json Content (based on{' '}
        <Link
          href={'/schemas/@wbcsd-product-footprint-2.0.0.schema.json'}
          className="underline"
          target="_blank"
        >
          the Pathfinder Technical Specification V2
        </Link>
        )
      </label>
      <CodeMirror
        className="mt-2 mb-6 bg-white drop-shadow"
        minHeight="200px"
        extensions={[json()]}
        onChange={handleCodeMirrorChangeSchemaJson}
        onBlur={onBlurValidate}
        value={formInput.schemaJson}
      />

      <div>
        <label htmlFor="readme">README.md Content</label>
        <CodeMirror
          className="mt-2 mb-6 bg-white drop-shadow"
          minHeight="200px"
          extensions={[markdown()]}
          onChange={handleCodeMirrorChangeReadme}
          value={formInput.readme}
        />
      </div>

      <input
        type="submit"
        value={submitting ? 'Loading...' : 'Submit'}
        className={
          submitting
            ? 'light-blue-primary-button-loading'
            : 'light-blue-primary-button'
        }
      />
    </form>
  );
}
