import Link from 'next/link';
import { FormEventHandler } from 'react';
import { Tab, TabRenderer, TabsLayout } from './tabs-layout';
import { useRouter } from 'next/router';

export default function SubmissionForm() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      publisher: { value: string };
      packageName: { value: string };
      industry: { value: string };
      status: { value: string };
      version: { value: string };
      packageJson: { value: string };
      readme: { value: string };
    };

    const data = {
      publisher: target.publisher.value,
      packageName: target.packageName.value,
      industry: target.industry.value,
      version: target.version.value,
      packageJson: target.packageJson.value,
      readme: target.readme.value,
    };

    const JSONdata = JSON.stringify(data)
  };

  const metadataTab: TabRenderer<any> = () => {
    const router = useRouter();
    return (
      <div className="flex flex-col">
        <label htmlFor="publisher">Publisher</label>
        <input
          type="text"
          id="publisher"
          name="publisher"
          required
          className="mt-2 mb-6 rounded-sm p-2"
        />

        <label htmlFor="packageName">Package Name</label>
        <input
          type="text"
          id="packageName"
          name="packageName"
          required
          className="mt-2 mb-6 rounded-sm p-2"
        />

        <label>Industry</label>
        <input list="industry" required className="mt-2 mb-6 rounded-sm p-2" />
        <datalist id="industry">
          <option value="Steel" />
          <option value="Another Industry" />
          <option value="Products" />
        </datalist>

        <label>Status</label>
        <input list="status" required className="mt-2 mb-6 rounded-sm p-2" />
        <datalist id="status" defaultValue={'Draft'}>
          <option value="Draft" />
          <option value="Published" disabled />
          <option value="Deprecated" disabled />
        </datalist>

        <label htmlFor="version">Version</label>
        <input
          type="text"
          id="version"
          name="version"
          required
          pattern="^\d+\.{2}\d+$"
          className="mt-2 mb-6 rounded-sm p-2"
        />

        <Link
          href={{
            pathname: router.asPath.split('?')[0],
            query: { activeTab: json.tabId },
          }}
          className="primary-button"
        >
          Continue
        </Link>
      </div>
    );
  };

  const metadata: Tab<any> = {
    tabId: 'metadata',
    title: 'Metadata',
    render: metadataTab,
  };

  const jsonTab: TabRenderer<any> = () => {
    const router = useRouter();

    return (
      <div className="flex flex-col">
        <label htmlFor="packageJson">Package JSON</label>
        <textarea
          id="packageJson"
          name="packageJson"
          required
          rows={10}
          className="mt-2 mb-6 rounded-sm p-2"
        />
        <Link
          href={{
            pathname: router.asPath.split('?')[0],
            query: { activeTab: readme.tabId },
          }}
          className="primary-button"
        >
          Continue
        </Link>
      </div>
    );
  };

  const json: Tab<any> = {
    tabId: 'json',
    title: 'JSON',
    render: jsonTab,
  };

  const readmeTab: TabRenderer<any> = () => {
    return (
      <div className="flex flex-col">
        <label htmlFor="readme">Readme</label>
        <textarea
          id="readme"
          name="readme"
          required
          rows={10}
          className="mt-2 mb-6 rounded-sm p-2"
        />

        <input type="submit" value="Submit" className="primary-button" />
      </div>
    );
  };

  const readme: Tab<any> = {
    tabId: 'readme',
    title: 'Readme',
    render: readmeTab,
  };

  const tabs: Tab<any>[] = [metadata, json, readme];

  return (
    <form onSubmit={handleSubmit}>
      <TabsLayout
        title={'New Package Submission'}
        tabs={tabs}
        content={null}
      ></TabsLayout>
    </form>
  );
}
