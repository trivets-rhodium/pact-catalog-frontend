import Link from 'next/link';
import { Tab, TabRenderFunction } from '../components/tabs';

const usageTab: TabRenderFunction = (e) => {
  return (
    <div>
      <h1>This is the Usage Tab</h1>
    </div>
  );
};

const usage: Tab = {
  tabId: 'usage',
  title: 'Usage',
  render: usageTab,
};

export default usage;
