import Link from 'next/link';
import { Tab, TabRenderer } from '../tabs-layout';
import style from '../../styles/Tabs.module.css';
import { ConformingSolution } from '../../lib/catalog-types';

const conformanceTab: TabRenderer<ConformingSolution> = (solution) => {
  return <div>TO DO</div>;
};

const explore: Tab<ConformingSolution> = {
  tabId: 'conformance',
  title: 'Conformance',
  render: conformanceTab,
};

export default explore;
