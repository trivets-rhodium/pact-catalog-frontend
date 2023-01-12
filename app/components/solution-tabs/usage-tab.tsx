import Link from 'next/link';
import { ConformingSolution } from '../../lib/catalog-types';
import { Tab, TabRenderer } from '../tabs';

const usageTab: TabRenderer<ConformingSolution> = (solution) => {
  const { extensions } = solution;

  return (
    <div>
      <section className="mb-12">
        <h2>Extensions Conformance</h2>
        <ul>
          {extensions.map(({ id, version, author }) => {
            return (
              <li className="my-4">
                <Link href={`/extensions/${id}/${version}`}>
                  <h3>
                    {id} {version}
                  </h3>
                </Link>
                <p>{author}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

const usage: Tab<ConformingSolution> = {
  tabId: 'usage',
  title: 'Usage',
  render: usageTab,
};

export default usage;