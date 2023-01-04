import Head from 'next/head';
import {
  getAllExtensions,
  getLatestExtensionsSorted,
} from '../lib/data-model-extensions';
import { GetStaticProps } from 'next';
import {
  CatalogDataModelExtension,
  ConformingSolution,
} from '../lib/catalog-types';
import Layout from '../components/layout';
import { getAllSolutions } from '../lib/solutions';
import React, { useEffect } from 'react';
import { Cards, extensionCards, solutionCards } from '../components/cards';
import SearchBar from '../components/search-bar';
import MiniSearch, { Options, SearchOptions, SearchResult } from 'minisearch';
import { late } from 'zod';
import Link from 'next/link';

type PageProps = {
  latestExtensions: CatalogDataModelExtension[];
  allSolutions: ConformingSolution[];
  allExtensions: CatalogDataModelExtension[];
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const latestExtensions = await getLatestExtensionsSorted();
  const allSolutions = await getAllSolutions();
  const allExtensions = await getAllExtensions();
  return {
    props: {
      latestExtensions,
      allSolutions,
      allExtensions,
    },
  };
};

type Search = {
  matchingExtensions: SearchResult[];
  matchingSolutions: SearchResult[];
  searchValue: string;
};

export default function Home(props: PageProps) {
  const [search, setSearch] = React.useState<Search>({
    matchingExtensions: new Array(),
    matchingSolutions: new Array(),
    searchValue: '',
  });

  const { latestExtensions, allSolutions, allExtensions } = props;

  const extensionSearchIndex: (CatalogDataModelExtension & {
    id: number;
    publisher: string;
  })[] = allExtensions.map((extension, index) => {
    return {
      ...extension,
      id: index + 1,
      publisher: extension.author.name,
    };
  });

  let miniSearchExtensions = new MiniSearch({
    fields: ['name', 'version', 'description', 'publisher'],
    storeFields: [
      'name',
      'version',
      'description',
      'publisher',
      'author',
      'catalog_info',
    ],
  });

  miniSearchExtensions.addAll(extensionSearchIndex);

  let miniSearchSolutions = new MiniSearch({
    fields: [
      'name',
      'providerName',
      'extensions',
      'summary',
      'conformance_tests',
    ],
    storeFields: [
      'id',
      'name',
      'providerName',
      'extensions',
      'summary',
      'conformance_tests',
      'extensions',
    ],
  });

  miniSearchSolutions.addAll(allSolutions);

  function handleSearchValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch({
      ...search,
      searchValue: event.target.value,
    });
  }

  useEffect(() => {
    const matchingExtensions = miniSearchExtensions.search(search.searchValue);
    const matchingSolutions = miniSearchSolutions.search(search.searchValue);

    setSearch({
      ...search,
      matchingExtensions,
      matchingSolutions,
    });
  }, [search.searchValue]);

  return (
    <Layout title="Online Catalog">
      <section>
        <SearchBar onSearchValueChange={handleSearchValueChange} />
      </section>

      <section>
        {search.searchValue === '' ? (
          <Cards
            title="Data Model Extensions"
            href="/extensions"
            cardsContent={latestExtensions.slice(0, 3)}
            render={extensionCards}
          />
        ) : (
          <Cards
            title="Data Model Extensions"
            href="/extensions"
            cardsContent={search.matchingExtensions}
            render={extensionCards}
          />
        )}
      </section>

      <section>
        {search.searchValue === '' ? (
          <Cards
            title="Conforming Solutions"
            href="/solutions"
            cardsContent={allSolutions.slice(0, 3)}
            render={solutionCards}
          />
        ) : (
          <Cards
            title="All Conforming Solutions"
            href="/solutions"
            cardsContent={search.matchingSolutions}
            render={solutionCards}
          />
        )}
      </section>
    </Layout>
  );
}
