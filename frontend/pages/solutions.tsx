import { GetStaticProps } from 'next';
import {
  ConformanceTestResult,
  ConformingSolution,
} from '../lib/catalog-types';
import Layout from '../components/layout';
import { getAllSolutions } from '../lib/solutions';
import React, { useEffect } from 'react';
import { Cards, solutionCards } from '../components/cards';
import MiniSearch, { SearchResult } from 'minisearch';
import { getAllTestResults } from '../lib/conformance-tests';
import SearchBar from '../components/search-bar';

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

export default function Solutions(props: PageProps) {
  const [search, setSearch] = React.useState({
    matchingSolutions: new Array(),
    searchValue: '',
    provider: '',
    result: '',
    options: {
      filter: undefined,
    },
  });

  const { allSolutions, allResults } = props;

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

    const matchingSolutions = miniSearchSolutions.search(searchValue, {
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
      matchingSolutions,
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
          title={`${matchingSolutions.length} ${
            result !== '' ? result : ''
          } Conforming Solution(s) for '${searchValue}' ${
            provider !== '' ? `from ${provider}` : ''
          }`}
          cardsContent={matchingSolutions}
          render={solutionCards}
        />
      );
    } else if (provider !== '' && result !== '') {
      return (
        <Cards
          title={`All ${result} Conforming Solutions, from ${provider}`}
          cardsContent={filterByProviderAndResult}
          render={solutionCards}
        />
      );
    } else if (provider !== '' && result === '') {
      return (
        <Cards
          title={`All Conforming Solutions from ${provider}`}
          cardsContent={filterByProvider}
          render={solutionCards}
        />
      );
    } else if (provider === '' && result !== '') {
      return (
        <Cards
          title={`All ${result} Conforming Solutions`}
          cardsContent={filterByResult}
          render={solutionCards}
        />
      );
    } else {
      return (
        <Cards
          title="All Conforming Solutions"
          cardsContent={allSolutions}
          render={solutionCards}
        />
      );
    }
  }

  return (
    <Layout title="Conforming Solutions">
      <section>
        <SearchBar
          onSearchValueChange={handleSearchValueChange}
          firstFilterName="providers"
          firstFilterContent={getAllProviders(allSolutions)}
          onFirstFilterChange={handleProviderChange}
          secondFilterName="results"
          secondFilterContent={getAllResults(allResults)}
          onSecondFilterChange={handleResultsChange}
          title={'Search Conforming Solutions'}
          placeholder={'e.g. Some Solution Provider'}
        />
      </section>

      <section>{displaySolutions()}</section>
    </Layout>
  );
}
