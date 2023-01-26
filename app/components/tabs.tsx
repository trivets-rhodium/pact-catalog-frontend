import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { string } from 'zod';
import style from '../styles/Tabs.module.css';

// as an idea, we could have a type for the tab render function
export type TabRenderer<T> = (content: T) => JSX.Element;

export type Tab<T> = {
  tabId: string;
  title: string;
  render: TabRenderer<T>;
};

type TabsProps<T> = {
  tabs: Tab<T>[];
  content: T;
};

function TabHead<T>(props: TabsProps<T>) {
  const { tabs } = props;
  const router = useRouter();

  const {
    query: { activeTab, search, industry, publisher, status },
    asPath,
  } = router;

  const defaultTab = () => {
    if (!activeTab) {
      router.query.activeTab = 'readme';
      return true;
    }
  };

  console.log(asPath);

  return (
    <div className="flex">
      {tabs.map(({ tabId, title }) => (
        <Link
          href={{
            // TO DO: improve path
            pathname: asPath.split('?')[0],
            query: {
              search,
              industry,
              publisher,
              status,
              activeTab: tabId,
            },
          }}
          key={tabId}
        >
          <div
            className={`${
              activeTab === tabId || defaultTab()
                ? style['active-tab']
                : style.tab
            } pt-2 pb-1 px-6 mr-1 rounded-t-md border-x-2 border-t-2 z-1`}
          >
            {title}
          </div>
        </Link>
      ))}
    </div>
  );
}

function TabContent<T>(props: TabsProps<T>) {
  const { tabs, content } = props;
  const router = useRouter();

  return (
    <>
      {tabs.map(({ tabId, render }) => {
        return (
          router.query.activeTab === tabId && (
            <div key={tabId}>{render(content)}</div>
          )
        );
      })}
    </>
  );
}

export function TabsLayout<T>(props: TabsProps<T> & { title: string }) {
  const {
    query: { search, industry, publisher, status },
  } = useRouter();
  return (
    <>
      <header>
        <h1 className="title">{props.title}</h1>
      </header>
      <TabHead {...props} />
      <div className="h-100 px-24 py-20 rounded-b-md rounded-tr-md border-2 z-0">
        <TabContent {...props} />

        <div className="flex justify-end">
          <Link href="/" className="secondary-button">
            Back to home
          </Link>
          <Link
            href={{
              pathname: '/extensions',
              query: {
                search,
                industry,
                publisher,
                status,
              },
            }}
            className="secondary-button ml-4"
          >
            Back to search
          </Link>
        </div>
      </div>
    </>
  );
}
