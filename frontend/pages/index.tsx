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

  const allPublishers = allPublishersNames.filter((name, index) => {
    return allPublishersNames.indexOf(name) == index;
  });

  return allPublishers;
}

type Search = {
  matchingExtensions: SearchResult[];
  searchValue: string;
  publisher: string;
  options: {
    filter: ((result: SearchResult) => boolean) | undefined;
  };
};

export default function Home(props: PageProps) {
  const [search, setSearch] = React.useState<Search>({
    matchingExtensions: new Array(),
    searchValue: '',
    publisher: '',
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
    fields: ['name', 'version', 'description'],
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
      options: {
        filter: (result: SearchResult) => {
          return result.publisher === event.target.value;
        },
      },
    });
  }

  useEffect(() => {
    const matchingExtensions = miniSearchExtensions.search(
      search.searchValue,
      search.options
    );

    setSearch({
      ...search,
      matchingExtensions,
    });
  });

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
        />
      </section>

      <section>
        {!search.matchingExtensions || search.searchValue === '' ? (
          <Cards
            title="Data Model Extensions"
            subtitle="Latest Extensions"
            cardsContent={latestExtensions}
            render={extensionCards}
          ></Cards>
        ) : (
          <Cards
            title="Data Model Extensions"
            subtitle={`Found ${
              search.matchingExtensions.length
            } Data Model Extensions with '${search.searchValue}' from ${
              search.publisher.length ? search.publisher : 'all publishers'
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
