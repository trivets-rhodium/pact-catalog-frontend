import Link from 'next/link';
import { Tab, TabRenderFunction } from '../tabs-layout';

const usageTab: TabRenderFunction = (tabArgs) => {
  const { extension, solutions } = tabArgs;
  return (
    <div>
      <section className="mb-12">
        <h2>Downloads (Weekly)</h2>
        <p>TO DO</p>
      </section>
      <section className="mb-12">
        <h2>Dependencies</h2>
        <ul>
          {extension.dependencies.map((dependency) => {
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
          {solutions !== undefined &&
            solutions.map((solution) => {
              return (
                <li key={solution.id}>
                  {`${solution.name} by ${solution.provider.name}`}
                </li>
              );
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
