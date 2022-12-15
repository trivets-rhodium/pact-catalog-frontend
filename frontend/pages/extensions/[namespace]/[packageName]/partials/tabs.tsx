// Includes everything related to tab rendering that is not specific to the extension. The Tab[] is
// imported in pages/extensions/[namespace]/[packageName]/[version].tsx

import Link from 'next/link';
import { Tab, TabRenderFunction } from '../../../../../components/tabs';
import { CatalogDataModelExtension } from '../../../../../lib/catalog-types';
import { getUser } from '../../../../../lib/users';

const readmeTab: TabRenderFunction = (e, endorsers) => {
  return (
    <>
      <section className="mb-8">
        <p>
          {e.catalog_info.summary === null
            ? e.description
            : e.catalog_info.summary}
        </p>
      </section>
      <section className="mb-8">
        <h1>Documentation</h1>
        {e.readmeMd !== null ? (
          <p>
            Please review the documentation via this{' '}
            <Link
              href={`https://github.com/sine-fdn/pact-catalog/catalog/data-model-extensions/${e.name}/${e.version}/documentation/README.md`}
              className="underline"
            >
              link
            </Link>
          </p>
        ) : (
          <p>No documentation available</p>
        )}
      </section>
      <section className="mb-8">
        <h1>API</h1>
        <p>Please access the API via this link (TO DO)</p>
      </section>
      <section className="mb-8">
        <h1>Publishers</h1>
        <p>This Data Model Extension is maintained by:</p>
        <ul className="pl-6">
          <li>
            <Link href={'#'} className="underline">
              {e.author}
            </Link>{' '}
            (author)
          </li>
          {e.contributors !== null &&
            e.contributors.map((contributor) => {
              return (
                <li>
                  <Link href={contributor.url} className="underline">
                    {contributor.name}
                  </Link>{' '}
                  (contributor)
                </li>
              );
            })}
        </ul>
      </section>
      <section className="mb-8">
        <h1>Endorsers</h1>
        <p>This Data Model Extension is endorsed by:</p>
        <ul className="pl-6">
          {endorsers !== undefined &&
            endorsers.map((endorser) => {
              return <li>{endorser.id}</li>;
            })}
        </ul>
      </section>
    </>
  );
};

const readme: Tab = {
  tabId: 'readme',
  title: 'Readme',
  render: readmeTab,
};

const exploreTab: TabRenderFunction = (e) => {
  return (
    <div>
      <h1>This is the Explore Tab</h1>
    </div>
  );
};

const usageTab: TabRenderFunction = (e) => {
  return (
    <div>
      <h1>This is the Usage Tab</h1>
    </div>
  );
};

const versionTab: TabRenderFunction = (e) => {
  return (
    <div>
      <h1 className="text-xl font-bold">{e.description}</h1>
      <p>{e.version}</p>
    </div>
  );
};

const explore: Tab = {
  tabId: 'explore',
  title: 'Explore',
  render: exploreTab,
};

const usage: Tab = {
  tabId: 'usage',
  title: 'Usage',
  render: usageTab,
};

const version: Tab = {
  tabId: 'version',
  title: 'Version',
  render: versionTab,
};

const tabs = [readme, explore, usage, version];

export default tabs;
