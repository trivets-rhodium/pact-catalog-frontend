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
import {
  Cards,
  extensionCards,
  cols,
  solutionCards,
} from '../components/cards';
import SearchBar from '../components/search-bar';
import MiniSearch, { SearchResult } from 'minisearch';

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

export default function Home(props: PageProps) {
  const [search, setSearch] = React.useState({
    matchingExtensions: new Array(),
    matchingSolutions: new Array(),
    searchValue: '',
  });

  const { latestExtensions, allSolutions, allExtensions } = props;
  const { searchValue, matchingExtensions, matchingSolutions } = search;

  for (const extension of allExtensions) {
    console.log('extension.schemaJson', extension.schemaJson);
  }

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

  const miniSearchExtensions = new MiniSearch({
    fields: ['name', 'version', 'description', 'publisher'],
    storeFields: [
      'name',
      'version',
      'description',
      'publisher',
      'author',
      'catalog_info',
      'endorsers',
    ],
  });

  miniSearchExtensions.addAll(extensionSearchIndex);

  const miniSearchSolutions = new MiniSearch({
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

  const searchTrigger = searchValue.length >= 3;

  // Generates message for button linking to all extensions/solutions
  function generateMessage(
    pool: CatalogDataModelExtension[] | ConformingSolution[] | SearchResult[],
    type: string
  ) {
    if (pool.length > cols - 1 && !searchTrigger) {
      return `See ${pool.length - (cols - 1)} other ${type}(s)...`;
    } else if (searchTrigger) {
      return `All ${type}s...`;
    } else {
      return undefined;
    }
  }

  function handleSearchValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch({
      ...search,
      searchValue: event.target.value,
    });
  }

  useEffect(() => {
    const matchingExtensions = miniSearchExtensions.search(searchValue);
    const matchingSolutions = miniSearchSolutions.search(searchValue);

    setSearch({
      ...search,
      matchingExtensions,
      matchingSolutions,
    });
  }, [searchValue]);

  return (
    <Layout title="Online Catalog">
      <section>
        <SearchBar
          title="Search the Catalog"
          placeholder="Search Data Model Extensions and Conforming Solutions"
          onSearchValueChange={handleSearchValueChange}
        />
      </section>

      {!searchTrigger ? (
        <section>
          <Cards
            title="Data Model Extensions"
            href="/extensions"
            message={generateMessage(allExtensions, 'extension')}
            cardsContent={latestExtensions.slice(0, cols - 1)}
            render={extensionCards}
          />

          <Cards
            title="Conforming Solutions"
            href="/solutions"
            message={generateMessage(allSolutions, 'solution')}
            cardsContent={allSolutions.slice(0, cols - 1)}
            render={solutionCards}
          />
        </section>
      ) : (
        <section>
          <Cards
            title={`${matchingExtensions.length} Data Model Extension(s) for '${searchValue}'`}
            href="/extensions"
            message={generateMessage(matchingExtensions, 'extension')}
            cardsContent={matchingExtensions.slice(0, cols - 1)}
            render={extensionCards}
          />

          <Cards
            title={`${matchingSolutions.length} Conforming Solution(s) for '${searchValue}'`}
            href="/solutions"
            message={generateMessage(matchingSolutions, 'solution')}
            cardsContent={matchingSolutions.slice(0, cols - 1)}
            render={solutionCards}
          />
        </section>
      )}
    </Layout>
  );
}
