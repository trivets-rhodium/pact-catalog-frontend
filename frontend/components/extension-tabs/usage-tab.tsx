import Link from 'next/link';
import { Tab, RenderExtensionTab } from '../tabs-layout';

const usageTab: RenderExtensionTab = (extension) => {
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
          {extension.conformingSolutions !== undefined &&
            extension.conformingSolutions.map((solution) => {
              return (
                <li key={solution.id}>
                  {`${solution.name} by ${solution.providerName}`}
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
  renderExtensionTab: usageTab,
};

export default usage;
