import Link from 'next/link';
import { CatalogDataModelExtension, Endorsers } from '../lib/catalog-types';
import { withRouter, NextRouter, Router } from 'next/router';
import React, { JSXElementConstructor } from 'react';
import style from '../styles/Tabs.module.css';

// as an idea, we could have a type for the tab render function
export type TabRenderFunction = (
  extension: CatalogDataModelExtension,
  endorsers?: Endorsers
) => JSX.Element;

export type Tab = {
  tabId: string;
  title: string;
  render: TabRenderFunction;
};

type TabsProps = {
  tabs: Tab[];
  router: NextRouter;
  extension: CatalogDataModelExtension;
  endorsers?: Endorsers;
};

function TabHead(props: TabsProps) {
  const { tabs, router } = props;

  const {
    query: { activeTab },
    asPath,
  } = router;

  return (
    <div className="flex">
      {tabs.map((tab) => (
        <div
          className={`${
            activeTab === tab.tabId ? style['active-tab'] : style.tab
          } pt-2 pb-1 px-6 mr-1 rounded-t-sm`}
        >
          <Link
            href={{
              pathname: asPath.replace(/\?.*/, ''),
              query: { activeTab: tab.tabId },
            }}
          >
            {tab.title}
          </Link>
        </div>
      ))}
    </div>
  );
}

function TabContent(props: TabsProps) {
  const { tabs, router, extension, endorsers } = props;
  return (
    <>
      {tabs.map((tab) => {
        return (
          router.query.activeTab === tab.tabId &&
          tab.render(extension, endorsers)
        );
      })}
    </>
  );
}

export function Tabs(props: TabsProps) {
  const { tabs, router, extension, endorsers } = props;

  console.log('tabs:', tabs);

  return (
    <>
      <TabHead tabs={tabs} router={router} extension={extension} />
      <div className="bg-white h-100 p-10 rounded-b-sm rounded-tr-sm">
        <TabContent
          tabs={tabs}
          router={router}
          extension={extension}
          endorsers={endorsers}
        ></TabContent>
        <div className="text-right mt-12">
          <Link href="/" className={style['tab-home-button']}>
            All Extensions
          </Link>
        </div>
      </div>
    </>
  );
}

export default withRouter(Tabs);
