import Link from 'next/link';
import { Tab, TabRenderer } from '../tabs';
import style from '../../styles/Tabs.module.css';
import {
  CatalogDataModelExtension,
  CompliantSolution,
  Endorsers,
} from '../../lib/catalog-types';
import Extension from '../../pages/extensions/[namespace]/[packageName]/[version]';

const readmeTab: TabRenderer<CompliantSolution> = (solution) => {
  const {name, summary, providerName, users, website} = solution;

  return (
    <div className="grid grid-cols-3 gap-20">
      <div className="col-span-2">
        <section className="mb-12">
          <h2>{name}</h2>
          <p>{summary}</p>
        </section>
        <section className="mb-12">
          <h2>Provider</h2>
          <p>{providerName}</p>
        </section>
        <section className="mb-12">
          <h2>Users</h2>
          <ul>
            {users &&
              users.map((user) => {
                return <li key={user.id}>{user.name}</li>;
              })}
          </ul>
        </section>
      </div>
      <div>
        <div className="sticky top-32 mt-4 mb-10 z-0">
          <a href={website} target="_blank" rel="noopener noreferrer">
            <div className="mb-8 primary-button">Find out more</div>
          </a>
        </div>
      </div>
    </div>
  );
};

const readme: Tab<CompliantSolution> = {
  tabId: 'readme',
  title: 'Readme',
  render: readmeTab,
};

export default readme;
