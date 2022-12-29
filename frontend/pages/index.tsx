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

export default function Home(props: PageProps) {
  const [search, setSearch] = React.useState({
    type: 'dataModelExtensions',
    value: {
      extensions: '',
      solutions: '',
    },
  });

  const { latestExtensions, allConformingSolutions, allExtensions } = props;

  const extensionIndex: (CatalogDataModelExtension & { id: number })[] =
    allExtensions.map((extension, index) => {
      return {
        ...extension,
        id: index + 1,
      };
    });

  const miniSearchOptionsExtensions = {
    fields: ['name', 'version'],
  };

  const miniSearchOptionsSolutions = {
    fields: ['name', 'provider', 'providerName', 'summary'],
  };

  const { search: searchExtensions, searchResults: searchExtensionsResults } =
    useMiniSearch(extensionIndex, miniSearchOptionsExtensions);

  const { search: searchSolutions, searchResults: searchSolutionsResults } =
    useMiniSearch(allConformingSolutions, miniSearchOptionsSolutions);

  function handleSearchValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = event.target.value;

    if (search.type === 'dataModelExtensions') {
      searchExtensions(event.target.value);
      setSearch({
        ...search,
        value: { ...search.value, extensions: searchValue },
      });
    } else {
      searchSolutions(searchValue);
      setSearch({
        ...search,
        value: { ...search.value, solutions: searchValue },
      });
    }
  }

  function handleSearchTypeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch({ ...search, type: event.target.value });
  }


  return (
    <Layout>
      <Head>
        <title>PACT Online Catalog</title>
      </Head>

      <section>
        <SearchBar
          onSearchValueChange={handleSearchValueChange}
          onSearchTypeChange={handleSearchTypeChange}
          searchState={search}
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
            title={`Searching Data Model Extensions with '${search.value.extensions}'`}
            cardsContent={searchExtensionsResults}
            render={extensionCards}
          />
        )}
      </section>

      <section>
        {!searchSolutionsResults || !searchSolutionsResults.length ? (
          <Cards
            title="All Conforming Solutions"
            cardsContent={allConformingSolutions}
            render={solutionCards}
          />
        ) : (
          <Cards
            title={`Searching Conforming Solutions with '${search.value.solutions}'`}
            cardsContent={searchSolutionsResults}
            render={solutionCards}
          />
        )}
      </section>
    </Layout>
  );
}
