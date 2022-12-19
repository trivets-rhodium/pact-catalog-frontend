import Link from 'next/link';
import { Tab, TabRenderFunction } from '../tabs-layout';
import { NextRouter } from 'next/router';

const versionTab: TabRenderFunction = (e, _, router) => {
  return (
    <div>
      <section className="mb-12">
        <h2>Current Tags</h2>
        <table className="table-auto mt-2">
          <thead>
            <tr>
              <th className="pr-32">Version</th>
              <th className="pr-32">Downloads (7 days)</th>
              <th className="pr-32">Tag</th>
            </tr>
          </thead>
          <tbody>
            {e.versions.map((version) => {
              return (
                <tr>
                  <td>{version}</td>
                  <td>TO DO</td>
                  <td>latest</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <section className="mb-12">
        <h2>Version History</h2>
        <p>TO DO: show deprecated toggle</p>
        <table className="table-auto mt-2">
          <thead>
            <tr>
              <th className="pr-32">Version</th>
              <th className="pr-32">Downloads (7 days)</th>
              <th className="pr-32">Published</th>
            </tr>
          </thead>
          <tbody>
            {e.versions.map((version) => {
              return (
                <tr>
                  <td>{version}</td>
                  <td>TO DO</td>
                  <td>TO DO</td>
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
  tabId: 'version',
  title: 'Version',
  render: versionTab,
};

export default version;
