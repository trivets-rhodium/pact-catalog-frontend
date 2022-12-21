import Link from 'next/link';
import { Tab, RenderExtensionTab } from '../tabs-layout';
import style from '../../styles/Tabs.module.css';
import { CatalogDataModelExtension, Endorsers } from '../../lib/catalog-types';
import Extension from '../../pages/extensions/[namespace]/[packageName]/[version]';

const readmeTab: RenderExtensionTab = (extension) => {
  return (
    <div className="grid grid-cols-3 gap-20">
      <div className="col-span-2">
        <section className="mb-12">
          <h2>
            {extension.name} {extension.version}
          </h2>
          <p>
            {extension.catalog_info.summary === null
              ? extension.description
              : extension.catalog_info.summary}
          </p>
        </section>
        <section className="mb-12">
          <h2>Contributors</h2>
          <ul>
            <li>
              <a href={extension.author.url} target="_blank">
                {extension.author.name}
              </a>{' '}
              (author)
            </li>
            {extension.contributors !== null &&
              extension.contributors.map((contributor) => {
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
            {extension.endorsers !== undefined &&
              extension.endorsers.map((endorser) => {
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
          <Link href={`${extension.downloadLink}`}>
            <div className="mb-8 primary-button">Download Package (TO DO)</div>
          </Link>
          <h3>Repository</h3>
          <a
            href={`${extension.gitRepositoryUrl}`}
            className="underline"
            target="_blank"
          >
            Github (TO DO)
          </a>
          <h3 className="mt-4">Last Published</h3>
          <p>TO DO</p>
          <h3 className="mt-4">Contacts</h3>
          <a href={`mailto: ${extension.author.email}`} className="underline">
            E-mail
          </a>
          ,{' '}
          <a href={extension.author.url} className="underline" target="_blank">
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
  renderExtensionTab: readmeTab,
};

export default readme;
