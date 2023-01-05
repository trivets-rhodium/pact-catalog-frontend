import Link from 'next/link';
import { Tab, TabRenderer } from '../tabs';
import style from '../../styles/Tabs.module.css';
import { CatalogDataModelExtension, Endorsers } from '../../lib/catalog-types';
import Extension from '../../pages/extensions/[namespace]/[packageName]/[version]';

const readmeTab: TabRenderer<CatalogDataModelExtension> = (extension) => {
  const {
    name,
    version,
    catalog_info,
    description,
    author,
    contributors,
    endorsers,
    downloadLink,
    gitRepositoryUrl,
  } = extension;

  return (
    <div className="grid grid-cols-3 gap-20">
      <div className="col-span-2">
        <section className="mb-12">
          <h2>
            {name} {version}
          </h2>
          <p>
            {catalog_info.summary === null ? description : catalog_info.summary}
          </p>
        </section>
        <section className="mb-12">
          <h2>Contributors</h2>
          <ul>
            <li>
              <a href={author.url} target="_blank" rel="noopener noreferrer">
                {author.name}
              </a>{' '}
              (author)
            </li>
            {contributors !== null &&
              contributors.map(({ name, url }) => {
                return (
                  <li key={name}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {name}
                    </a>{' '}
                  </li>
                );
              })}
          </ul>
        </section>
        <section className="mb-12">
          <h2>Endorsers</h2>
          <ul>
            {endorsers &&
              endorsers.map(({ id, website, name }) => {
                return (
                  <li key={id}>
                    {website !== null ? (
                      <a
                        target="_blank"
                        href={website}
                        rel="noopener noreferrer"
                      >
                        {name}
                      </a>
                    ) : (
                      name
                    )}
                  </li>
                );
              })}
          </ul>
        </section>
      </div>
      <div>
        <div className="sticky top-32 mt-4 mb-10 z-0">
          <Link href={`${downloadLink}`}>
            <div className="mb-8 primary-button">Download Package (TO DO)</div>
          </Link>
          <h3>Repository</h3>
          <a
            href={`${gitRepositoryUrl}`}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github (TO DO)
          </a>
          <h3 className="mt-4">Last Published</h3>
          <p>TO DO</p>
          <h3 className="mt-4">Contacts</h3>
          <a
            href={`mailto: ${author.email}`}
            className="underline"
            rel="noopener noreferrer"
          >
            E-mail
          </a>
          ,{' '}
          <a
            href={author.url}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Website
          </a>
        </div>
      </div>
    </div>
  );
};

const readme: Tab<CatalogDataModelExtension> = {
  tabId: 'readme',
  title: 'Readme',
  render: readmeTab,
};

export default readme;