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
import Link from 'next/link';

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

function getAllIndustries(allSolutions: ConformingSolution[]): string[] {
  const allIndustries = allSolutions.map((solution) => {
    return solution.industries;
  });

  const industries = allIndustries.flat();

  return industries.filter((industry, index) => {
    return industries.indexOf(industry) === index;
  });
}

function getAllProviders(allSolutions: ConformingSolution[]): string[] {
  const allProvidersNames = allSolutions.map((solution) => {
    return solution.providerName;
  });

  return allProvidersNames.filter((name, index) => {
    return allProvidersNames.indexOf(name) === index;
  });
}

function getProviderByIndustry(
  industry: string,
  allSolutions: ConformingSolution[]
): string[] {
  const filteredSolutions = allSolutions.filter((solution) => {
    return solution.industries.includes(industry);
  });

  const filteredProvidersNames = filteredSolutions.map((solution) => {
    return solution.providerName;
  });

  return filteredProvidersNames.filter((name, index) => {
    return filteredProvidersNames.indexOf(name) === index;
  });
}

function getAllResults(allResults: ConformanceTestResult[]): string[] {
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
    industry: '',
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
      'industries',
    ],
  });

  miniSearchSolutions.addAll(allSolutions);

  function handleSearchValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch({
      ...search,
      searchValue: event.target.value,
    });
  }

  function handleIndustryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearch({
      ...search,
      industry: event.target.value,
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
    const { industry, provider, result, searchValue } = search;

    const matchingSolutions = miniSearchSolutions.search(searchValue, {
      filter: (searchResult: SearchResult) => {
        if (industry !== '' && !searchResult.industries.includes(industry)) {
          return false;
        }
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
  }, [search.searchValue, search.industry, search.provider, search.result]);

  function resetSearch() {
    return (
      <div className="text-right">
        <Link href={'/solutions'} className="secondary-button">
          {'<'} Reset
        </Link>
      </div>
    );
  }

  function displaySolutions() {
    const { searchValue, industry, provider, result, matchingSolutions } =
      search;

    const filterByIndustry = allSolutions.filter((solution) => {
      return solution.industries.includes(industry);
    });

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

    const filterByIndustryAndResult = filterByIndustry.filter((solution) => {
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
        <>
          <Cards
            title={`${matchingSolutions.length} ${
              result !== '' ? result : ''
            } ${
              industry !== '' ? `${industry} related` : ''
            } Conforming Solutions for '${searchValue}' ${
              provider !== '' ? `from ${provider}` : ''
            }`}
            cardsContent={matchingSolutions}
            render={solutionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry !== '' && provider === '' && result === '') {
      return (
        <>
          <Cards
            title={`All ${industry} related Conforming Solutions`}
            cardsContent={filterByIndustry}
            render={solutionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (provider !== '' && result !== '') {
      return (
        <>
          <Cards
            title={`All ${result} Conforming Solutions, from ${provider}`}
            cardsContent={filterByProviderAndResult}
            render={solutionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (provider !== '' && result === '') {
      return (
        <>
          <Cards
            title={`All Conforming Solutions from ${provider}`}
            cardsContent={filterByProvider}
            render={solutionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry !== '' && provider === '' && result !== '') {
      return (
        <>
          <Cards
            title={`All ${industry} related ${result} Conforming Solutions`}
            cardsContent={filterByIndustryAndResult}
            render={solutionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (provider === '' && result !== '') {
      return (
        <>
          <Cards
            title={`All ${result} Conforming Solutions`}
            cardsContent={filterByResult}
            render={solutionCards}
          />
          {resetSearch()}
        </>
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
          firstFilterName="industries"
          firstFilterContent={getAllIndustries(allSolutions)}
          onFirstFilterChange={handleIndustryChange}
          secondFilterName="providers"
          secondFilterContent={
            search.industry === ''
              ? getAllProviders(allSolutions)
              : getProviderByIndustry(search.industry, allSolutions)
          }
          onSecondFilterChange={handleProviderChange}
          thirdFilterName="results"
          thirdFilterContent={getAllResults(allResults)}
          onThirdFilterChange={handleResultsChange}
          title={'Search Conforming Solutions'}
          placeholder={'e.g. Some Solution Provider'}
        />
      </section>

      <section>{displaySolutions()}</section>
    </Layout>
  );
}
