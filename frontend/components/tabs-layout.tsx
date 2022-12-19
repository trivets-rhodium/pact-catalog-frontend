import Link from 'next/link';
import { CatalogDataModelExtension, Endorsers } from '../lib/catalog-types';
import { withRouter, NextRouter, Router } from 'next/router';
import React, { JSXElementConstructor } from 'react';
import style from '../styles/Tabs.module.css';

// as an idea, we could have a type for the tab render function
export type TabRenderFunction = (
  extension: CatalogDataModelExtension,
  endorsers?: Endorsers,
  router?: NextRouter
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
        <Link
          href={{
            pathname: asPath.replace(/\?.*/, ''),
            query: { activeTab: tab.tabId },
          }}
        >
          <div
            className={`${
              activeTab === tab.tabId ? style['active-tab'] : style.tab
            } pt-2 pb-1 px-6 mr-1 rounded-t-md border-x-2 border-t-2 z-1`}
          >
            {tab.title}
          </div>
        </Link>
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

export function TabsLayout(props: TabsProps) {
  const { tabs, router, extension, endorsers } = props;

  console.log('tabs:', tabs);

  return (
    <>
      <header>
        <h1 className='title'>{extension.description}</h1>
      </header>
      <TabHead tabs={tabs} router={router} extension={extension} />
      <div className="background h-100 px-24 py-20 rounded-b-md rounded-tr-md border-2 z-0">
        <TabContent
          tabs={tabs}
          router={router}
          extension={extension}
          endorsers={endorsers}
        ></TabContent>
        <div className="text-right mt-16">
          <Link href="/" className="secondary-button">
            All Extensions
          </Link>
        </div>
      </div>
    </>
  );
}

export default withRouter(TabsLayout);
