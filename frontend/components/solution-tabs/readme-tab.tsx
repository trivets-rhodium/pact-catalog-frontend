import Link from 'next/link';
import { Tab, RenderExtensionTab, RenderSolutionTab } from '../tabs-layout';
import style from '../../styles/Tabs.module.css';
import { CatalogDataModelExtension, Endorsers } from '../../lib/catalog-types';
import Extension from '../../pages/extensions/[namespace]/[packageName]/[version]';

const readmeTab: RenderSolutionTab = (solution) => {
  return (
    <div className="grid grid-cols-3 gap-20">
      <div className="col-span-2">
        <section className="mb-12">
          <p>{solution.summary}</p>
        </section>
        <section className="mb-12">
          <h2>Provider</h2>
          <p>{solution.providerName}</p>
        </section>
        <section className="mb-12">
          <div></div>
          <h2>Users</h2>
          {/* {solution.users &&
            solution.users.map((user) => {
              return <p>{user.name}</p>;
            })} */}
          <p>TO DO</p>
        </section>
      </div>
      <div>
        <div className="sticky top-32 mt-4 mb-10 z-0">
          <a href={solution.website} target="_blank">
            <div className="mb-8 primary-button">Find out more</div>
          </a>
        </div>
      </div>
    </div>
  );
};

const readme: Tab = {
  tabId: 'readme',
  title: 'Readme',
  renderSolutionTab: readmeTab,
};

export default readme;
