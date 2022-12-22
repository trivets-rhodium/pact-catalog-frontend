import Link from 'next/link';
import { ConformingSolution } from '../../lib/catalog-types';
import { Tab, TabRenderer } from '../tabs-layout';

const usageTab: TabRenderer<ConformingSolution> = (solution) => {
  return <div>TO DO</div>;
};

const usage: Tab<ConformingSolution> = {
  tabId: 'usage',
  title: 'Usage',
  render: usageTab,
};

export default usage;
