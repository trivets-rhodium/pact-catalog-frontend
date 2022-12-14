import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { CatalogDataModelExtension } from '../lib/catalog-types'
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
    <div className={`${selected ? style['selected-tab'] : 'bg-white'} p-2 mr-1 rounded-t-sm`}>
      <Link href={{ pathname: asPath.replace(/\?.*/, ''), query: { tab: tabName } }}>
        {tabName}
      </Link>
    </div >
  )
}

type TabsProps = {
  router: NextRouter,
  tabNames: string[]
}

export function Tabs(props: TabsProps) {
  const { router, tabNames } = props;

  return (
    <div className='p-2 pt-0 mx-12'>
      <div className='flex'>
        {
          tabNames.map((tabName) => (
            <Tab tabName={tabName} router={router} />
          ))
        }
      </div>
      <div className='h-full bg-white'>
        {router.query.tab === tabNames[0] && <React.Fragment>This is tab one content</React.Fragment>}
        {router.query.tab === tabNames[1] && <React.Fragment>This is tab two content</React.Fragment>}
      </div>
    </div>
  )
};

export default withRouter(Tabs)
