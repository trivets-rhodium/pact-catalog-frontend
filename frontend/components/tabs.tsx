import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { CatalogDataModelExtension, DetailTab, ExtensionDetails } from '../lib/catalog-types'
import { withRouter, NextRouter, Router } from "next/router"
import React from 'react'
import style from '../styles/Tabs.module.css'

type TabProps = {
  tabName: string,
  router: NextRouter,
}

export function Tab(props: TabProps) {
  const { tabName, router } = props;
  const { query: { tab }, asPath } = router;
  const selected = tab === tabName;

  return (
    <div className={`${selected ? style['selected-tab'] : style.tab} pt-2 pb-1 px-6 mr-1 rounded-t-sm`}>
      <Link href={{ pathname: asPath.replace(/\?.*/, ''), query: { tab: tabName } }}>
        {tabName}
      </Link>
    </div >
  )
}

type TabsProps = {
  router: NextRouter,
  tabs: ExtensionDetails,
}

export function Tabs(props: TabsProps) {
  const { router, tabs } = props;

  return (
    <div className='p-2 pt-0 mx-12'>
      <div className='flex'>
        {
          tabs.map((tab) => (
            <Tab tabName={tab.name} router={router} />
          ))
        }
      </div>
      <div className='h-full bg-white p-8 rounded-b-sm rounded-tr-sm'>
        {
          tabs.map((tab) => (
            router.query.tab === tab.name && <div className='mb-8' dangerouslySetInnerHTML={{ __html: tab.content }} />
          ))
        }
        <div className='text-right'>
          <Link href="/" className={style['tab-home-button']}>All Extensions</Link>
        </div>

      </div>
    </div>
  )
};

export default withRouter(Tabs)
