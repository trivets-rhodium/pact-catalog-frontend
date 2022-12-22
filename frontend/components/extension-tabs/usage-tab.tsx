import Link from 'next/link';
import { CatalogDataModelExtension } from '../../lib/catalog-types';
import { Tab, TabRenderer } from '../tabs-layout';

const usageTab: TabRenderer<CatalogDataModelExtension> = (extension) => {
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
          {extension.conformingSolutions &&
            extension.conformingSolutions.map((solution) => {
              return (
                <li key={solution.id}>
                  <Link href={`/solutions/${solution.id}`}>
                    {`${solution.name} by ${solution.providerName}`}
                  </Link>
                </li>
              );
            })}
        </ul>
      </section>
    </div>
  );
};

const usage: Tab<CatalogDataModelExtension> = {
  tabId: 'usage',
  title: 'Usage',
  render: usageTab,
};

export default usage;
