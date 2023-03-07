import { GetStaticProps } from 'next';
import {
  ConformanceTestResult,
  ConformingSolution,
} from '../lib/catalog-types';
import Layout from '../components/layout';
import { getAllSolutions } from '../lib/solutions';
import React, { useEffect, useState } from 'react';
import { Cards, solutionCards } from '../components/cards';
import MiniSearch, { SearchResult } from 'minisearch';
import { getAllTestResults } from '../lib/conformance-tests';
import SearchBar, { FilterOption } from '../components/search-bar';
import Link from 'next/link';
import { useRouter } from 'next/router';

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

function getAllIndustries(
  allSolutions: ConformingSolution[],
  targetSolutions: ConformingSolution[]
): FilterOption[] {
  const allIndustries = allSolutions.map((solution) => {
    if (solution.industries !== null) {
      return solution.industries;
    } else {
      return [];
    }
  });

  const industries = allIndustries.flat();

  const uniqueIndustries = industries.filter((industry, index) => {
    return industries.indexOf(industry) === index;
  });

  const industryOptions = uniqueIndustries.map((industry) => {
    return {
      option: industry,
      count: 0,
    };
  });

  for (const option of industryOptions) {
    for (const solution of targetSolutions) {
      if (solution.industries?.includes(option.option)) {
        option.count += 1;
      }
    }
  }

  return industryOptions;
}

function getAllProviders(
  allSolutions: ConformingSolution[],
  targetSolutions: ConformingSolution[]
): FilterOption[] {
  const allProvidersNames = allSolutions.map((solution) => {
    return solution.providerName;
  });

  const uniqueProviders = allProvidersNames.filter((name, index) => {
    return allProvidersNames.indexOf(name) === index;
  });

  const providerOptions = uniqueProviders.map((provider) => {
    return {
      option: provider,
      count: 0,
    };
  });

  for (const option of providerOptions) {
    for (const solution of targetSolutions) {
      if (solution.providerName === option.option) {
        option.count += 1;
      }
    }
  }

  return providerOptions;
}

function getAllResults(
  allResults: ConformanceTestResult[],
  targetSolutions: ConformingSolution[]
): FilterOption[] {
  const allTestResults: string[] = allResults.map((result) => {
    return result.test_result;
  });

  allTestResults.push('pending conformance');

  const uniqueResults = allTestResults.filter((result, index) => {
    return allTestResults.indexOf(result) === index;
  });

  const resultOptions = uniqueResults.map((result) => {
    return {
      option: result,
      count: 0,
    };
  });

  for (const option of resultOptions) {
    for (const solution of targetSolutions) {
      if (solution.conformance_tests.length !== 0) {
        for (const test of solution.conformance_tests) {
          if (test.test.test_result === option.option) {
            option.count += 1;
          }
        }
      } else {
        if (option.option === 'pending conformance') {
          option.count += 1;
        }
      }
    }
  }

  const passed = resultOptions.find((option) => option.option === 'passed');

  let tbdCount = 0;

  if (passed) {
    tbdCount = targetSolutions.length - passed.count;
  }

  const tbd = resultOptions.find((option) => option.option === 'tbd');

  tbd && (tbd.count = tbdCount);

  return resultOptions;
}

export default function Solutions(props: PageProps) {
  const router = useRouter();

  const {
    query: { search, industry, provider, result },
  } = router;

  const [searchState, setSearchState] = useState({
    matchingSolutions: new Array(),
    searchValue: (search as string) || '',
    industry: (industry as string) || '',
    provider: (provider as string) || '',
    result: (result as string) || '',
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
    setSearchState({
      ...searchState,
      searchValue: event.target.value,
    });

    if (event.target.value === '') {
      delete router.query.search;
    } else {
      router.query.search = event.target.value;
    }

    router.push({
      pathname: router.pathname,
      query: router.query,
    });
  }

  function handleIndustryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearchState({
      ...searchState,
      industry: event.target.value,
    });

    if (event.target.value === '') {
      delete router.query.industry;
    } else {
      router.query.industry = event.target.value;
    }

    router.push({
      pathname: router.pathname,
      query: router.query,
    });
  }

  function handleProviderChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearchState({
      ...searchState,
      provider: event.target.value,
    });

    if (event.target.value === '') {
      delete router.query.provider;
    } else {
      router.query.provider = event.target.value;
    }

    router.push({
      pathname: router.pathname,
      query: router.query,
    });
  }

  function handleResultsChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearchState({
      ...searchState,
      result: event.target.value,
    });

    if (event.target.value === '') {
      delete router.query.result;
    } else {
      router.query.result = event.target.value;
    }

    router.push({
      pathname: router.pathname,
      query: router.query,
    });
  }

  useEffect(() => {
    const { industry, provider, result, searchValue } = searchState;

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

    setSearchState({
      ...searchState,
      matchingSolutions,
    });
  }, [
    searchState.searchValue,
    searchState.industry,
    searchState.provider,
    searchState.result,
  ]);

  function resetSearch() {
    return (
      <div className="text-right">
        <button
          className="green-secondary-button"
          onClick={() => {
            setSearchState({
              matchingSolutions: new Array(),
              searchValue: '',
              industry: '',
              provider: '',
              result: '',
              options: {
                filter: undefined,
              },
            });
            router.push('/solutions');
          }}
        >
          Reset filters
        </button>
      </div>
    );
  }

  const filterByIndustry = allSolutions.filter((solution) => {
    if (solution.industries) {
      return solution.industries.includes(searchState.industry);
    }
  });

  const filterByProvider = allSolutions.filter((solution) => {
    return solution.providerName === searchState.provider;
  });

  const filterByResult = allSolutions.filter((solution) => {
    if (searchState.result === 'pending conformance') {
      return solution.conformance_tests.length === 0;
    } else {
      return solution.conformance_tests.some((test) => {
        return test.test.test_result === searchState.result;
      });
    }
  });

  const filterByIndustryandProvider = allSolutions.filter((solution) => {
    return (
      solution.industries &&
      solution.industries.includes(searchState.industry) &&
      solution.providerName === searchState.provider
    );
  });

  const filterByIndustryAndResult = filterByIndustry.filter((solution) => {
    return solution.conformance_tests.some((test) => {
      return test.test.test_result === searchState.result;
    });
  });

  const filterByProviderAndResult = filterByProvider.filter((solution) => {
    return solution.conformance_tests.some((test) => {
      return test.test.test_result === searchState.result;
    });
  });

  const filterByIndustryAndProviderAndResult = filterByIndustry.filter(
    (solution) => {
      return (
        solution.providerName === searchState.provider &&
        solution.conformance_tests?.some((test) => {
          return test.test.test_result === searchState.result;
        })
      );
    }
  );

  function displaySolutions() {
    const { searchValue, industry, provider, result, matchingSolutions } =
      searchState;

    if (searchValue !== '') {
      return (
        <>
          <Cards
            title={`${matchingSolutions.length} ${
              result !== '' ? result : ''
            } ${
              industry !== '' ? `${industry} related` : ''
            } PACT Conforming Solutions for '${searchValue}' ${
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
            title={`All ${industry} related PACT Conforming Solutions`}
            cardsContent={filterByIndustry}
            render={solutionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry !== '' && provider !== '' && result !== '') {
      return (
        <>
          <Cards
            title={`All ${industry} related ${result} PACT Conforming Solutions, from ${provider}`}
            cardsContent={filterByIndustryAndProviderAndResult}
            render={solutionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry !== '' && provider !== '' && result === '') {
      return (
        <>
          <Cards
            title={`All ${industry} related PACT Conforming Solutions, from ${provider}`}
            cardsContent={filterByIndustryandProvider}
            render={solutionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry === '' && provider !== '' && result !== '') {
      return (
        <>
          <Cards
            title={`All ${result} PACT Conforming Solutions, from ${provider}`}
            cardsContent={filterByProviderAndResult}
            render={solutionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry === '' && provider !== '' && result === '') {
      return (
        <>
          <Cards
            title={`All PACT Conforming Solutions from ${provider}`}
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
            title={`All ${industry} related ${result} PACT Conforming Solutions`}
            cardsContent={filterByIndustryAndResult}
            render={solutionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry === '' && provider === '' && result !== '') {
      return (
        <>
          <Cards
            title={`All ${result} PACT Conforming Solutions`}
            cardsContent={filterByResult}
            render={solutionCards}
          />
          {resetSearch()}
        </>
      );
    } else {
      return (
        <Cards
          title="All PACT Conforming Solutions"
          cardsContent={allSolutions}
          render={solutionCards}
        />
      );
    }
  }

  function setIndustryOptions(): FilterOption[] {
    if (provider === undefined && result === undefined) {
      return getAllIndustries(allSolutions, allSolutions);
    } else if (provider !== undefined && result === undefined) {
      return getAllIndustries(allSolutions, filterByProvider);
    } else if (provider === undefined && result !== undefined) {
      return getAllIndustries(allSolutions, filterByResult);
    } else {
      return getAllIndustries(allSolutions, filterByProviderAndResult);
    }
  }

  function setProviderOptions(): FilterOption[] {
    if (industry === undefined && result === undefined) {
      return getAllProviders(allSolutions, allSolutions);
    } else if (industry !== undefined && result === undefined) {
      return getAllProviders(allSolutions, filterByIndustry);
    } else if (industry === undefined && result !== undefined) {
      return getAllProviders(allSolutions, filterByResult);
    } else {
      return getAllProviders(allSolutions, filterByIndustryAndResult);
    }
  }

  function setResultOptions(): FilterOption[] {
    if (industry === undefined && provider === undefined) {
      return getAllResults(allResults, allSolutions);
    } else if (industry !== undefined && provider === undefined) {
      return getAllResults(allResults, filterByIndustry);
    } else if (industry === undefined && provider !== undefined) {
      return getAllResults(allResults, filterByProvider);
    } else {
      return getAllResults(allResults, filterByIndustryandProvider);
    }
  }

  return (
    <Layout title="PACT Conforming Solutions">
      <section>
        <SearchBar
          searchValue={searchState.searchValue}
          onSearchValueChange={handleSearchValueChange}
          firstFilterName="industries"
          firstFilterContent={setIndustryOptions()}
          firstFilterValue={searchState.industry}
          onFirstFilterChange={handleIndustryChange}
          secondFilterName="providers"
          secondFilterContent={setProviderOptions()}
          secondFilterValue={searchState.provider}
          onSecondFilterChange={handleProviderChange}
          thirdFilterName="results"
          thirdFilterContent={setResultOptions()}
          thirdFilterValue={searchState.result}
          onThirdFilterChange={handleResultsChange}
          title={'Search PACT Conforming Solutions'}
          placeholder={'e.g. Some Solution Provider'}
          color="green"
        />
      </section>

      <section>{displaySolutions()}</section>
    </Layout>
  );
}
