import Link from 'next/link';
import {
  CatalogDataModelExtension,
  ConformingSolution,
  Endorsers,
} from '../lib/catalog-types';
import { withRouter, NextRouter, Router } from 'next/router';
import React, { JSXElementConstructor } from 'react';
import style from '../styles/Tabs.module.css';

// as an idea, we could have a type for the tab render function
export type RenderExtensionTab = (
  content: CatalogDataModelExtension
) => JSX.Element;

export type RenderSolutionTab = (content: ConformingSolution) => JSX.Element;

export type TabRenderer<T> = (content: T) => JSX.Element;

export type Tab<T> = {
  tabId: string;
  title: string;
  render: TabRenderer<T>;
};

type TabsProps<T> = {
  tabs: Tab<T>[];
  router: NextRouter;
  content: T;
};

function TabHead<T>(props: TabsProps<T>) {
  const { tabs, router } = props;

  const {
    query: { activeTab },
    asPath,
  } = router;

  const defaultTab = () => {
    if (!router.query.activeTab) {
      router.query.activeTab = 'readme';
      return true;
    }
  };

  return (
    <div className="flex">
      {tabs.map((tab) => (
        <Link
          href={{
            pathname: asPath.replace(/\?.*/, ''),
            query: { activeTab: tab.tabId },
          }}
          key={tab.tabId}
        >
          <div
            className={`${activeTab === tab.tabId || defaultTab()
              ? style['active-tab']
              : style.tab
              } pt-2 pb-1 px-6 mr-1 rounded-t-md border-x-2 border-t-2 z-1`}
          >
            {tab.title}
          </div>
        </Link>
      ))}
    </div>
  );
}

function TabContent<T>(props: TabsProps<T>) {
  const { tabs, router, content } = props;

  return (
    <>
      {tabs.map((tab) => {
        return (
          router.query.activeTab === tab.tabId && (
            <div key={tab.tabId}>
              {tab.render(content)}
            </div>
          )
        );
      })}
    </>
  );
}

export function TabsLayout<T>(props: TabsProps<T> & { title: string }) {
  const { tabs, router, content } = props;

  return (
    <>
      <header>
        <h1 className="title">{props.title}</h1>
      </header>
      <TabHead {...props} />
      <div className="background h-100 px-24 py-20 rounded-b-md rounded-tr-md border-2 z-0">
        <TabContent {...props} />
        <div className="text-right mt-16">
          <Link href="/" className="secondary-button">
            Back to home
          </Link>
        </div>
      </div>
    </>
  );
}

export default withRouter(TabsLayout);
