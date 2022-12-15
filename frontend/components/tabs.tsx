import Head from 'next/head';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import {
  CatalogDataModelExtension,
  DetailTab,
  ExtensionDetails,
} from '../lib/catalog-types';
import { withRouter, NextRouter, Router } from 'next/router';
import React, { JSXElementConstructor } from 'react';
import style from '../styles/Tabs.module.css';
import { match } from 'assert';

type TabProps = {
  detailTab: DetailTab;
  router: NextRouter;
};

export function Tab(props: TabProps) {
  const { detailTab, router } = props;
  const {
    query: { tab },
    asPath,
  } = router;
  const selected = tab === detailTab.name;

  return (
    <div
      className={`${
        selected ? style['selected-tab'] : style.tab
      } pt-2 pb-1 px-6 mr-1 rounded-t-sm`}
    >
      <Link
        href={{
          pathname: asPath.replace(/\?.*/, ''),
          query: { tab: detailTab.name },
        }}
      >
        {detailTab.name}
      </Link>
    </div>
  );
}

export function renderTabContent(detailTab: DetailTab) {
  switch (detailTab.name) {
    case 'Read Me':
      return (
        <div
          className="mb-8"
          dangerouslySetInnerHTML={{ __html: detailTab.content as string }}
        />
      );
      break;
    default:
      return Object.values(detailTab.content).map((val) => {
        return <div className="mb-8">{val}</div>;
      });
      break;
  }
}

export function TabContent(props: TabProps) {
  const tabContent = renderTabContent(props.detailTab);

  return <>{tabContent}</>;
}

type TabsProps = {
  router: NextRouter;
  tabs: ExtensionDetails;
};

export function Tabs(props: TabsProps) {
  const { router, tabs } = props;

  return (
    <div className="p-2 pt-0 mx-12">
      <div className="flex">
        {tabs.map((tab) => (
          <Tab detailTab={tab} router={router} />
        ))}
      </div>
      <div className="h-full bg-white p-8 rounded-b-sm rounded-tr-sm">
        {tabs.map(
          (tab) =>
            router.query.tab === tab.name && (
              <TabContent detailTab={tab} router={router} />
            )
        )}
        <div className="text-right">
          <Link href="/" className={style['tab-home-button']}>
            All Extensions
          </Link>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Tabs);
