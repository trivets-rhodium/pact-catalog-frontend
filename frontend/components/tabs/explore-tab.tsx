import Link from 'next/link';
import { Tab, TabRenderFunction } from '../tabs-layout';
import style from '../../styles/Tabs.module.css';

const exploreTab: TabRenderFunction = (e) => {
  return (
    <div>
      <section className="mb-12">
        <h2>Documentation</h2>
        {e.readmeMd !== null ? (
          <p>
            Please review the documentation via this (TO DO){' '}
            <a
              href={`https://github.com/sine-fdn/pact-catalog/catalog/data-model-extensions/${e.name}/${e.version}/documentation/README.md`}
              className="underline"
              target="_blank"
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

const explore: Tab = {
  tabId: 'explore',
  title: 'Explore',
  render: exploreTab,
};

export default explore;
