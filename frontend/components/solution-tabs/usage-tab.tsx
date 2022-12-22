import Link from 'next/link';
import { ConformingSolution } from '../../lib/catalog-types';
import { Tab, TabRenderer } from '../tabs-layout';

const usageTab: TabRenderer<ConformingSolution> = (solution) => {
  return (
    <div>
      <section className="mb-12">
        <h2>Extensions Conformance</h2>
        <ul>
          {solution.extensions.map((extension) => {
            return (
              <li className='my-4'>
                <Link href={`/extensions/${extension.id}/${extension.version}`}>
                  <h3>
                    {extension.id} {extension.version}
                  </h3>
                </Link>
                <p>{extension.author}</p>
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
