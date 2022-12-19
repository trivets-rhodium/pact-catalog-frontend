import Link from 'next/link';
import { Tab, TabRenderFunction } from '../components/tabs';

const exploreTab: TabRenderFunction = (e) => {
  return (
    <div>
      <h1>This is the Explore Tab</h1>
    </div>
  );
};

const explore: Tab = {
  tabId: 'explore',
  title: 'Explore',
  render: exploreTab,
};

export default explore;
