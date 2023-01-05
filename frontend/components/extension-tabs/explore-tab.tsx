import Link from 'next/link';
import { Tab, TabRenderer } from '../tabs';
import style from '../../styles/Tabs.module.css';
import { CatalogDataModelExtension } from '../../lib/catalog-types';

const exploreTab: TabRenderer<CatalogDataModelExtension> = (extension) => {
  const { readmeMd, name, version } = extension;

  return (
    <div>
      <section className="mb-12">
        <h2>Documentation</h2>
        {readmeMd ? (
          <p>
            Please review the documentation via this (TO DO){' '}
            <a
              href={`https://github.com/sine-fdn/pact-catalog/catalog/data-model-extensions/${name}/${version}/documentation/README.md`}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              link
            </a>
          </p>
        ) : (
          <p>No documentation available</p>
        )}
      </section>
      <section className="mb-12">
        <h2>API</h2>
        <p>Please access the API via this link (TO DO)</p>
      </section>
    </div>
  );
};

const explore: Tab<CatalogDataModelExtension> = {
  tabId: 'explore',
  title: 'Explore',
  render: exploreTab,
};

export default explore;
