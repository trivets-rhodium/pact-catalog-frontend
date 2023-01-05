import Link from 'next/link';
import { CatalogDataModelExtension } from '../../lib/catalog-types';
import { Tab, TabRenderer } from '../tabs';

const usageTab: TabRenderer<CatalogDataModelExtension> = (extension) => {
  const { dependencies, conformingSolutions } = extension;

  return (
    <div>
      <section className="mb-12">
        <h2>Downloads (Weekly)</h2>
        <p>TO DO</p>
      </section>
      <section className="mb-12">
        <h2>Dependencies</h2>
        <ul>
          {dependencies.map(({ namespace, packageName, version }) => {
            return (
              <Link
                href={`/extensions/${namespace}/${packageName}/${version}`}
                key={`${namespace}/${packageName}/${version}`}
              >
                <li>
                  {namespace} {packageName} {version}
                </li>
              </Link>
            );
          })}
        </ul>
      </section>
      <section className="mb-12">
        <h2>Conforming Solutions</h2>
        <ul>
          {conformingSolutions &&
            conformingSolutions.map(({ id, name, providerName }) => {
              return (
                <li key={id}>
                  <Link href={`/solutions/${id}`}>
                    {`${name} by ${providerName}`}
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
