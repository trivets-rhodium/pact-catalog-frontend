import Link from 'next/link';
import { Tab, TabRenderFunction } from '../components/tabs';

const versionTab: TabRenderFunction = (e) => {
  return (
    <div>
      <h1 className="text-xl font-bold">{e.description}</h1>
      <p>{e.version}</p>
    </div>
  );
};

const version: Tab = {
  tabId: 'version',
  title: 'Version',
  render: versionTab,
};

export default version;
