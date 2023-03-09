import Link from 'next/link';
import { Tab, TabRenderer } from '../tabs';
import style from '../../styles/Tabs.module.css';
import { ConformingSolution } from '../../lib/catalog-types';

const conformanceTab: TabRenderer<ConformingSolution> = (solution) => {
  const { conformance_tests } = solution;
  return (
    <div>
      <section className="mb-12">
        <h2>Tests</h2>
        {solution.conformance_tests.length !== 0 ? (
          <table className="table-auto mt-2">
            <thead>
              <tr className="">
                <th className="text-left px-4 py-2 border-4 border-white bg-gray-50">
                  Tester
                </th>
                <th className="text-left px-4 py-2 border-4 border-white bg-gray-50">
                  Date
                </th>
                <th className="text-left px-4 py-2 border-4 border-white bg-gray-50">
                  Pathfinder Version
                </th>
                <th className="text-left px-4 py-2 border-4 border-white bg-gray-50">
                  Extensions
                </th>
                <th className="text-left px-4 py-2 border-4 border-white bg-gray-50">
                  Result
                </th>
              </tr>
            </thead>
            <tbody className="align-top text-sm">
              {conformance_tests &&
                conformance_tests.map(({ test, tester }) => {
                  return (
                    <tr key={`${test}-${tester}`}>
                      <td className="text-left px-4 py-2 border-4 border-white bg-gray-50">
                        <Link href={`/solutions/${tester.id}`}>
                          {tester.name}
                        </Link>
                      </td>
                      <td className="text-left px-4 py-2 border-4 border-white bg-gray-50">
                        {test.test_date}
                      </td>
                      <td className="text-left px-4 py-2 border-4 border-white bg-gray-50">
                        <Link
                          href={'/extensions/@wbcsd/product-footprint/2.0.0'}
                        >
                          {test.pathfinder_version}
                        </Link>
                      </td>
                      <td className="text-left px-4 py-2 border-4 border-white bg-gray-50">
                        {test.extensions_tested.map(
                          ({ extension, version }) => {
                            return (
                              <Link
                                href={`/extensions/${extension}/${version}`}
                                key={`${extension}/${version}`}
                              >
                                <p>{extension}</p>
                              </Link>
                            );
                          }
                        )}
                      </td>
                      <td className="text-left px-4 py-2 border-4 border-white bg-gray-50">
                        {test.test_result}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <p>This solution has not been submitted to conformance tests</p>
        )}
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
