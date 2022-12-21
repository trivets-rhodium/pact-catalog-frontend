import Link from 'next/link';
import { Tab, RenderExtensionTab, RenderSolutionTab } from '../tabs-layout';

const usageTab: RenderSolutionTab = (solution) => {
  return <div>TO DO</div>;
};

const usage: Tab = {
  tabId: 'usage',
  title: 'Usage',
  renderSolutionTab: usageTab,
};

export default usage;
