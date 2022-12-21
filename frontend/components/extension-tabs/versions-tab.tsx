import Link from 'next/link';
import { Tab, RenderExtensionTab } from '../tabs-layout';
import { NextRouter } from 'next/router';

const versionTab: RenderExtensionTab = (extension) => {

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
            {extension.versions.map((version) => {
              return (
                <tr>
                  <Link href={`/extensions/${extension.name}/${version}`}>
                    {version}
                  </Link>
                  <td>TO DO</td>
                  <td>{extension.catalog_info.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const version: Tab = {
  tabId: 'versions',
  title: 'Versions',
  renderExtensionTab: versionTab,
};

export default version;
