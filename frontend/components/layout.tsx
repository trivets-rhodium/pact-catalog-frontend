import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { CatalogDataModelExtension } from '../lib/catalog-types'

export default function Layout({
  children,
  extension
}: {
  children: React.ReactNode
  extension?: CatalogDataModelExtension
}) {
  return (
    <>
      <Head>
        <title>{
          extension == undefined ? 'PACT Online Catalog' : `PACT Catalog - ${extension.description}`
        }</title>
      </Head>
      <header className='pact-color py-8 px-14'>
        <h1 className='text-white font-bold font-avenir text-2xl'>
          {
            extension == undefined ? 'WBCSD | PACT Online Catalog' : `${extension.description}`
          }
        </h1>
      </header>
      <main>{children}</main>
      {
        extension !== undefined && (
          <Link href="/">← Back to home</Link>
        )
      }
    </>
  )
}
