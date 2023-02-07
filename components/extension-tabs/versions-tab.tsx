import Link from 'next/link';
import { Tab, TabRenderer } from '../tabs';
import { NextRouter } from 'next/router';
import { CatalogDataModelExtension } from '../../lib/catalog-types';

const versionTab: TabRenderer<CatalogDataModelExtension> = (extension) => {
  const { versions, name, catalog_info } = extension;
  return (
    <div>
      <section className="mb-12">
        <h2>Version History</h2>
        <table className="table-auto mt-2">
          <thead>
            <tr>
              <th className="pr-32">Version</th>
              <th className="pr-32">Downloads (7 days)</th>
              <th className="pr-32">Status</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((version) => {
              return (
                <tr key={version}>
                  <td>
                    <Link href={`/extensions/${name}/${version}`}>
                      {version}
                    </Link>
                  </td>
                  <td>TO DO</td>
                  <td>{catalog_info.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const version: Tab<CatalogDataModelExtension> = {
  tabId: 'versions',
  title: 'Versions',
  render: versionTab,
};

export default version;
