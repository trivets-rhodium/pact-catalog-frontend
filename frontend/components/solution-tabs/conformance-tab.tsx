import Link from 'next/link';
import { Tab, TabRenderer } from '../tabs-layout';
import style from '../../styles/Tabs.module.css';
import { ConformingSolution } from '../../lib/catalog-types';

const conformanceTab: TabRenderer<ConformingSolution> = (solution) => {
  const { conformance_tests } = solution;
  return (
    <div>
      <section className="mb-12">
        <h2>Tests</h2>
        <table className="table-auto mt-2">
          <thead>
            <tr>
              <th className="pr-32">Tester</th>
              <th className="pr-32">Date</th>
              <th className="pr-32">Extensions</th>
              <th className="pr-32">Result</th>
            </tr>
          </thead>
          <tbody className="align-top text-sm">
            {conformance_tests &&
              conformance_tests.map(({ test, tester }) => {
                return (
                  <tr>
                    <td>
                      <Link href={`/solutions/${tester.id}`}>
                        {tester.name}
                      </Link>
                    </td>
                    <td>{test.test_date}</td>
                    <td>
                      {test.tests.map(({ extension, version }) => {
                        return (
                          <Link href={`/extensions${extension}/${version}`}>
                            <p>{extension}</p>
                          </Link>
                        );
                      })}
                    </td>
                    <td>{test.test_result}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const explore: Tab<ConformingSolution> = {
  tabId: 'conformance',
  title: 'Conformance',
  render: conformanceTab,
};

export default explore;
