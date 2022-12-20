// Includes everything related to the readme tab rendering that is not specific to the extension. The Tab is
// imported in pages/extensions/[namespace]/[packageName]/[version].tsx

import Link from 'next/link';
import { Tab, TabRenderFunction } from '../tabs-layout';
import style from '../../styles/Tabs.module.css';

const readmeTab: TabRenderFunction = (e, endorsers) => {
  return (
    <div className="grid grid-cols-3 gap-20">
      <div className="col-span-2">
        <section className="mb-12">
          <h2>
            {e.name} {e.version}
          </h2>
          <p>
            {e.catalog_info.summary === null
              ? e.description
              : e.catalog_info.summary}
          </p>
        </section>
        <section className="mb-12">
          <h2>Contributors</h2>
          <ul>
            <li>
              <a href={e.author.url} target="_blank">
                {e.author.name}
              </a>{' '}
              (author)
            </li>
            {e.contributors !== null &&
              e.contributors.map((contributor) => {
                return (
                  <li key={contributor.name}>
                    <a href={contributor.url} target="_blank">
                      {contributor.name}
                    </a>{' '}
                  </li>
                );
              })}
          </ul>
        </section>
        <section className="mb-12">
          <h2>Endorsers</h2>
          <ul>
            {endorsers !== undefined &&
              endorsers.map((endorser) => {
                return (
                  <li key={endorser.id}>
                    {endorser.website !== null ? (
                      <a
                        target="_blank"
                        href={endorser.website}
                        rel="noopener noreferrer"
                      >
                        {endorser.name}
                      </a>
                    ) : (
                      endorser.name
                    )}
                  </li>
                );
              })}
          </ul>
        </section>
      </div>
      <div>
        <div className="sticky top-32 mt-4 mb-10 z-0">
          <div className="mb-8 primary-button">
            <Link href={`${e.downloadLink}`}>Download Package (TO DO)</Link>
          </div>
          <h3>Repository</h3>
          <a
            href={`${e.gitRepositoryUrl}`}
            className="underline"
            target="_blank"
          >
            Github (TO DO)
          </a>
          <h3 className="mt-4">Last Published</h3>
          <p>TO DO</p>
          <h3 className="mt-4">Contacts</h3>
          <a href={`mailto: ${e.author.email}`} className="underline">
            E-mail
          </a>
          ,{' '}
          <a href={e.author.url} className="underline" target="_blank">
            Website
          </a>
        </div>
      </div>
    </div>
  );
};

const readme: Tab = {
  tabId: 'readme',
  title: 'Readme',
  render: readmeTab,
};

export default readme;
