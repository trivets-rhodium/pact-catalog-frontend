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
              <Link href={'#'}>{e.author}</Link> (author)
            </li>
            {e.contributors !== null &&
              e.contributors.map((contributor) => {
                return (
                  <li key={contributor.name}>
                    <Link href={contributor.url}>{contributor.name}</Link>{' '}
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
          <div className="mb-8">
            <Link href={`${e.downloadLink}`} className="primary-button">
              Download Package
            </Link>
          </div>
          <h3>Repository</h3>
          <Link href={`${e.gitRepositoryUrl}`} className="underline">
            Github
          </Link>
          <h3 className="mt-4">Last Published</h3>
          <p>TO DO</p>
          <h3 className="mt-4">Contacts</h3>
          <Link href={'#'} className="underline">
            E-mail
          </Link>
          ,{' '}
          <Link href={'#'} className="underline">
            Website
          </Link>
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
