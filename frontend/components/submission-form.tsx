import { FormEventHandler } from 'react';

type FormProps = {
  submitHandler: FormEventHandler<HTMLFormElement>;
};

export default function SubmissionForm(props: FormProps) {
  return (
    <form onSubmit={props.submitHandler}>
      <div className="flex flex-col">
        <label htmlFor="publisherName">Publisher Name</label>
        <input
          type="text"
          id="publisherName"
          name="publisherName"
          required
          className="mt-2 mb-6 rounded-sm p-2"
        />

        <label htmlFor="publisherUserId">Publisher User Id</label>
        <input
          type="text"
          id="publisherUserId"
          name="publisherUserId"
          className="mt-2 mb-6 rounded-sm p-2"
          required
        />

        <label htmlFor="publisherEmail">Publisher Email</label>
        <input
          type="text"
          id="publisherEmail"
          name="publisherEmail"
          className="mt-2 mb-6 rounded-sm p-2"
          required
        />

        <label htmlFor="publisherUrl">Publisher Website</label>
        <input
          type="text"
          id="publisherUrl"
          name="publisherUrl"
          className="mt-2 mb-6 rounded-sm p-2"
          required
        />

        {/* TO DO: Possibility of adding contributors */}

        <label htmlFor="packageName">Package Name</label>
        <input
          type="text"
          id="packageName"
          name="packageName"
          pattern="[^\s]+"
          required
          className="mt-2 mb-6 rounded-sm p-2"
        />

        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          required
          className="mt-2 mb-6 rounded-sm p-2"
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
          required
          pattern="^(\d+\.){2}\d+$"
          className="mt-2 mb-6 rounded-sm p-2"
        />

        <label htmlFor="summary">Summary (optional)</label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={5}
          className="mt-2 mb-6 rounded-sm p-2"
        />

        <label htmlFor="schemaJson">schema.json Content</label>
        <textarea
          id="schemaJson"
          name="schemaJson"
          required
          rows={10}
          className="mt-2 mb-6 rounded-sm p-2"
        />

        <label htmlFor="readme">README.md Content</label>
        <textarea
          id="readme"
          name="readme"
          required
          rows={10}
          className="mt-2 mb-6 rounded-sm p-2"
        />

        <input type="submit" value="Submit" className="primary-button" />
      </div>
    </form>
  );
}
