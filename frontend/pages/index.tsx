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
  allConformingSolutions: ConformingSolution[];
  allExtensions: CatalogDataModelExtension[];
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const latestExtensions = await getLatestExtensionsSorted();
  const allConformingSolutions = await getAllSolutions();
  const allExtensions = await getAllExtensions();
  return {
    props: {
      latestExtensions,
      allConformingSolutions,
      allExtensions,
    },
  };
};

function getAllPublishers(
  allExtensions: CatalogDataModelExtension[],
  allConformingSolutions: ConformingSolution[]
): string[] {
  const allAuthorsNames = allExtensions.map((extension) => {
    return extension.author.name;
  });

  const allProvidersNames = allConformingSolutions.map((solution) => {
    return solution.providerName;
  });

  const allPublishersNames = allAuthorsNames.concat(allProvidersNames);

  return allPublishersNames.filter((name, index) => {
    return allPublishersNames.indexOf(name) === index;
  });
}

function getAllStatus(allExtensions: CatalogDataModelExtension[]) {
  const allStatus = allExtensions.map((extension) => {
    return extension.catalog_info.status;
  });

  allStatus.push('deprecated');

  return allStatus.filter((status, index) => {
    return allStatus.indexOf(status) === index;
  });
}

type Search = {
  matchingExtensions: SearchResult[];
  searchValue: string;
  publisher: string;
  status: string;
  options: {
    filter: ((result: SearchResult) => boolean) | undefined;
  };
};

export default function Home(props: PageProps) {
  const [search, setSearch] = React.useState<Search>({
    matchingExtensions: new Array(),
    searchValue: '',
    publisher: 'all publishers',
    status: 'all status',
    options: {
      filter: undefined,
    },
  });

  const { latestExtensions, allConformingSolutions, allExtensions } = props;

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

  function handleSearchValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch({
      ...search,
      searchValue: event.target.value,
    });
  }

  function handlePublisherChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearch({
      ...search,
      publisher: event.target.value,
    });
  }

  function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearch({
      ...search,
      status: event.target.value,
    });
  }

  useEffect(() => {
    const { publisher, status } = search;

    const matchingExtensions = miniSearchExtensions.search(search.searchValue, {
      filter: (result: SearchResult) => {
        if (publisher !== 'all publishers' && publisher !== result.publisher) {
          return false;
        }
        if (status !== 'all status' && status !== result.catalog_info.status) {
          return false;
        }
        return true;
      },
    });

    setSearch({
      ...search,
      matchingExtensions,
    });
  }, [search.searchValue, search.publisher, search.status]);

  return (
    <Layout>
      <Head>
        <title>PACT Online Catalog</title>
      </Head>

      <section>
        <SearchBar
          onSearchValueChange={handleSearchValueChange}
          publishers={getAllPublishers(allExtensions, allConformingSolutions)}
          onPublisherChange={handlePublisherChange}
          status={getAllStatus(allExtensions)}
          onStatusChange={handleStatusChange}
        />
      </section>

      <section>
        {!search.matchingExtensions || !search.searchValue.length ? (
          <Cards
            title="Data Model Extensions"
            subtitle="Latest Extensions"
            cardsContent={latestExtensions}
            render={extensionCards}
          />
        ) : (
          <Cards
            title="Data Model Extensions"
            subtitle={`Found ${search.matchingExtensions.length} ${
              search.status !== 'all status' ? search.status : ''
            } Data Model Extensions with '${search.searchValue}' from ${
              search.publisher
            }`}
            cardsContent={search.matchingExtensions}
            render={extensionCards}
          />
        )}
      </section>

      <section>
        <Cards
          title="All Conforming Solutions"
          cardsContent={allConformingSolutions}
          render={solutionCards}
        />
      </section>
    </Layout>
  );
}

// function handleSearchTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
//   setSearch({ ...search, type: event.target.value });
// }

// function handlePublisherChange(event: React.ChangeEvent<HTMLSelectElement>) {
//   setSearch({
//     ...search,
//     publisher: event.target.value,
//   });
// }
