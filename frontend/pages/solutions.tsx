import Head from 'next/head';
import { GetStaticProps } from 'next';
import {
  CatalogDataModelExtension,
  ConformanceTestResult,
  ConformingSolution,
  SolutionTestResults,
} from '../lib/catalog-types';
import Layout from '../components/layout';
import { getAllSolutions } from '../lib/solutions';
import React, { useEffect } from 'react';
import { Cards, extensionCards, solutionCards } from '../components/cards';
import SolutionSearchBar from '../components/solution-search-bar';
import MiniSearch, { Options, SearchOptions, SearchResult } from 'minisearch';
import {
  getAllTestResults,
  getSolutionTestResults,
} from '../lib/conformance-tests';

type PageProps = {
  allSolutions: ConformingSolution[];
  allResults: ConformanceTestResult[];
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const allSolutions = await getAllSolutions();
  const allResults = await getAllTestResults();

  return {
    props: {
      allSolutions,
      allResults,
    },
  };
};

function getAllProviders(allSolutions: ConformingSolution[]): string[] {
  const allProvidersNames = allSolutions.map((solution) => {
    return solution.providerName;
  });

  return allProvidersNames.filter((name, index) => {
    return allProvidersNames.indexOf(name) === index;
  });
}

function getAllResults(allResults: ConformanceTestResult[]) {
  const allTestResults = allResults.map((result) => {
    return result.test_result;
  });

  // TO DO: include only represented results?
  allTestResults.push('failed');
  allTestResults.push('ongoing');

  return allTestResults.filter((result, index) => {
    return allTestResults.indexOf(result) === index;
  });
}

type Search = {
  matchingSolutions: SearchResult[];
  searchValue: string;
  provider: string;
  result: string;
  options: {
    filter: ((result: SearchResult) => boolean) | undefined;
  };
};

export default function Solutions(props: PageProps) {
  const [search, setSearch] = React.useState<Search>({
    matchingSolutions: new Array(),
    searchValue: '',
    provider: '',
    result: '',
    options: {
      filter: undefined,
    },
  });

  const { allSolutions, allResults } = props;

  let miniSearchExtensions = new MiniSearch({
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

  miniSearchExtensions.addAll(allSolutions);

  function handleSearchValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch({
      ...search,
      searchValue: event.target.value,
    });
  }

  function handleProviderChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearch({
      ...search,
      provider: event.target.value,
    });
  }

  function handleResultsChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearch({
      ...search,
      result: event.target.value,
    });
  }

  useEffect(() => {
    const { provider, result, searchValue } = search;

    const matchingExtensions = miniSearchExtensions.search(searchValue, {
      filter: (searchResult: SearchResult) => {
        if (provider !== '' && provider !== searchResult.providerName) {
          return false;
        }
        if (
          result !== '' &&
          searchResult.conformance_tests.some((test: ConformanceTestResult) => {
            return test.test_result !== result;
          })
        ) {
          return false;
        }
        return true;
      },
    });

    setSearch({
      ...search,
      matchingSolutions: matchingExtensions,
    });
  }, [search.searchValue, search.provider, search.result]);

  function displaySolutions() {
    const { searchValue, provider, result, matchingSolutions } = search;

    const filterByProvider = allSolutions.filter((solution) => {
      return solution.providerName === provider;
    });

    const filterByResult = allSolutions.filter((solution) => {
      return (
        solution.conformance_tests &&
        solution.conformance_tests.some((test) => {
          return test.test.test_result === result;
        })
      );
    });

    const filterByProviderAndResult = filterByProvider.filter((solution) => {
      return (
        solution.conformance_tests &&
        solution.conformance_tests.some((test) => {
          return test.test.test_result === result;
        })
      );
    });

    if (searchValue !== '') {
      return (
        <Cards
          title="Conforming Solutions"
          subtitle={`Found ${matchingSolutions.length} ${
            result !== '' ? result : ''
          } solutions with '${searchValue}' ${
            provider !== '' ? `from ${provider}` : ''
          }`}
          cardsContent={matchingSolutions}
          render={solutionCards}
        />
      );
    } else if (provider !== '' && result !== '') {
      return (
        <Cards
          title="Conforming Solutions"
          subtitle={`All ${result} extensions, from ${provider}`}
          cardsContent={filterByProviderAndResult}
          render={solutionCards}
        />
      );
    } else if (provider !== '' && result === '') {
      return (
        <Cards
          title="Conforming Solutions"
          subtitle={`All solutions from ${provider}`}
          cardsContent={filterByProvider}
          render={solutionCards}
        />
      );
    } else if (provider === '' && result !== '') {
      return (
        <Cards
          title="Conforming Solutions"
          subtitle={`All ${result} solutions`}
          cardsContent={filterByResult}
          render={solutionCards}
        />
      );
    } else {
      return (
        <Cards
          title="Data Model Extensions"
          subtitle="All solutions"
          cardsContent={allSolutions}
          render={solutionCards}
        />
      );
    }
  }

  return (
    <Layout title="Data Model Extensions">
      <section>
        <SolutionSearchBar
          onSearchValueChange={handleSearchValueChange}
          providers={getAllProviders(allSolutions)}
          onProviderChange={handleProviderChange}
          results={getAllResults(allResults)}
          onResultChange={handleResultsChange}
        />
      </section>

      <section>{displaySolutions()}</section>
    </Layout>
  );
}
