import Link from 'next/link';
import { Tab, TabRenderFunction } from '../tabs-layout';

const usageTab: TabRenderFunction = (e) => {
  return (
    <div>
      <section className="mb-12">
        <h2>Downloads (Weekly)</h2>
        <p>TO DO</p>
      </section>
      <section className="mb-12">
        <h2>Dependencies</h2>
        <ul>
          {e.dependencies.map((dependency) => {
            return (
              <Link
                href={`/extensions/${dependency.namespace}/${dependency.packageName}/${dependency.version}`}
                key={`${dependency.namespace}/${dependency.packageName}/${dependency.version}`}
              >
                <li>
                  {dependency.namespace} {dependency.packageName}{' '}
                  {dependency.version}
                </li>
              </Link>
            );
          })}
        </ul>
      </section>
      <section className="mb-12">
        <h2>Conforming Solutions</h2>
        <ul>
          TO DO
          {e.conformingSolutions.map((solution) => {
            return <li key={solution.id}>{solution.toString()}</li>;
          })}
        </ul>
      </section>
    </div>
  );
};

const usage: Tab = {
  tabId: 'usage',
  title: 'Usage',
  render: usageTab,
};

export default usage;
