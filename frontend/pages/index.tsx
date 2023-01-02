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
import { useMiniSearch } from 'react-minisearch';
import React from 'react';
import { Cards, extensionCards, solutionCards } from '../components/cards';
import SearchBar from '../components/search-bar';
import { boolean } from 'zod';
import { Options, SearchOptions, SearchResult } from 'minisearch';

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

export default function Home(props: PageProps) {
  const [search, setSearch] = React.useState({
    matchingExtensions: [],
    searchValue: '',
    publisher: '',
  });

  const { latestExtensions, allConformingSolutions, allExtensions } = props;

  const extensionIndex: (CatalogDataModelExtension & {
    id: number;
    publisher: string;
  })[] = allExtensions.map((extension, index) => {
    return {
      ...extension,
      id: index + 1,
      publisher: extension.author.name,
    };
  });

  let miniSearchOptionsExtensions: Options<
    CatalogDataModelExtension & {
      id: number;
      publisher: string;
    }
  > = {
    fields: ['name', 'version', 'description'],
    storeFields: ['publisher'],
  };
  // const miniSearchOptionsSolutions = {
  //   fields: ['name', 'summary'],
  //   storeFileds: ['providerName'],
  // };

  const { search: searchExtensions, searchResults: searchExtensionsResults } =
    useMiniSearch(extensionIndex, miniSearchOptionsExtensions);

  // const { search: searchSolutions, searchResults: searchSolutionsResults } =
  //   useMiniSearch(allConformingSolutions, miniSearchOptionsSolutions);

  function handleSearchValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch({
      ...search,
      searchValue: event.target.value,
    });

    searchExtensions(search.searchValue, miniSearchOptionsExtensions);
  }

  function handlePublisherChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearch({
      ...search,
      publisher: event.target.value,
    });

    searchExtensions(search.searchValue, miniSearchOptionsExtensions);

    searchExtensionsResults &&
      searchExtensionsResults.filter(
        (
          result: CatalogDataModelExtension & {
            id: number;
            publisher: string;
          }
        ) => {
          return result.publisher === event.target.value;
        }
      );
  }

  return (
    <Layout>
      <Head>
        <title>PACT Online Catalog</title>
      </Head>

      <section>
        <SearchBar
          onSearchValueChange={handleSearchValueChange}
          publishers={getAllPublishers(allExtensions, allConformingSolutions)}
        />
      </section>

      <section>
        {!searchExtensionsResults || !searchExtensionsResults.length ? (
          <Cards
            title="Latest Data Model Extensions"
            cardsContent={latestExtensions}
            render={extensionCards}
          ></Cards>
        ) : (
          <Cards
            title={`Searching Data Model Extensions with '${search.searchValue}'`}
            cardsContent={searchExtensionsResults}
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
