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

export type Tab = {
  tabId: string;
  title: string;
  renderExtensionTab?: RenderExtensionTab;
  renderSolutionTab?: RenderSolutionTab;
};

type TabsProps = {
  tabs: Tab[];
  router: NextRouter;
  extension?: CatalogDataModelExtension;
  solution?: ConformingSolution;
};

function TabHead(props: TabsProps) {
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
            className={`${
              activeTab === tab.tabId || defaultTab()
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

function TabContent(props: TabsProps) {
  const { tabs, router, extension, solution } = props;

  return (
    <>
      {tabs.map((tab) => {
        return (
          router.query.activeTab === tab.tabId && (
            <div key={tab.tabId}>
              {(extension &&
                tab.renderExtensionTab &&
                tab.renderExtensionTab(extension)) ||
                (solution &&
                  tab.renderSolutionTab &&
                  tab.renderSolutionTab(solution))}
            </div>
          )
        );
      })}
    </>
  );
}

export function TabsLayout(props: TabsProps) {
  const { tabs, router, extension, solution } = props;

  return (
    <>
      <header>
        <h1 className="title">
          {(extension && extension.description) || (solution && solution.name)}
        </h1>
      </header>
      <TabHead
        tabs={tabs}
        router={router}
        extension={extension}
        solution={solution}
      />
      <div className="background h-100 px-24 py-20 rounded-b-md rounded-tr-md border-2 z-0">
        <TabContent
          tabs={tabs}
          router={router}
          extension={extension}
          solution={solution}
        ></TabContent>
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
