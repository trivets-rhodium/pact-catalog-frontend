import Link from 'next/link';
import { Tab, RenderExtensionTab, RenderSolutionTab } from '../tabs-layout';
import style from '../../styles/Tabs.module.css';

const conformanceTab: RenderSolutionTab = (solution) => {
  return <div>TO DO</div>;
};

const explore: Tab = {
  tabId: 'conformance',
  title: 'Conformance',
  renderSolutionTab: conformanceTab,
};

export default explore;
