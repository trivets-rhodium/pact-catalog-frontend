import { getAllExtensions } from '../lib/data-model-extensions';
import { GetStaticProps } from 'next';
import {
  CatalogDataModelExtension,
  ParsedSchemaJson,
} from '../lib/catalog-types';
import Layout from '../components/layout';
import React, { useEffect, useState } from 'react';
import { Cards, extensionCards } from '../components/cards';
import MiniSearch, { SearchResult } from 'minisearch';
import SearchBar, { FilterOption } from '../components/search-bar';
import { useRouter } from 'next/router';
import { unknown } from 'zod';
import Link from 'next/link';

type PageProps = {
  allExtensions: CatalogDataModelExtension[];
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const allExtensions = await getAllExtensions();
  return {
    props: {
      allExtensions,
    },
  };
};

function getAllIndustries(
  allExtensions: CatalogDataModelExtension[],
  targetExtensions: CatalogDataModelExtension[]
): FilterOption[] {
  const allIndustries = allExtensions.map((extension) => {
    return extension.industries;
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
    for (const extension of targetExtensions) {
      if (extension.industries.includes(option.option)) {
        option.count += 1;
      }
    }
  }

  return industryOptions;
}

function getAllPublishers(
  allExtensions: CatalogDataModelExtension[],
  targetExtensions: CatalogDataModelExtension[]
): FilterOption[] {
  const allPublishers = allExtensions.map((extension) => {
    return extension.author.name;
  });

  const uniquePublishers = allPublishers.filter((name, index) => {
    return allPublishers.indexOf(name) === index;
  });

  const publisherOptions = uniquePublishers.map((publisher) => {
    return {
      option: publisher,
      count: 0,
    };
  });

  for (const option of publisherOptions) {
    for (const extension of targetExtensions) {
      if (extension.author.name === option.option) {
        option.count += 1;
      }
    }
  }

  return publisherOptions;
}

function getAllStatuses(
  allExtensions: CatalogDataModelExtension[],
  targetExtensions: CatalogDataModelExtension[]
): FilterOption[] {
  const allStatuses = allExtensions.map((extension) => {
    return extension.catalog_info.status;
  });

  // TO DO: include only represented statuses?
  allStatuses.push('deprecated');

  const uniqueStatuses = allStatuses.filter((status, index) => {
    return allStatuses.indexOf(status) === index;
  });

  const statusOptions = uniqueStatuses.map((status) => {
    return {
      option: status,
      count: 0,
    };
  });

  for (const option of statusOptions) {
    for (const extension of targetExtensions) {
      if (extension.catalog_info.status === option.option) {
        option.count += 1;
      }
    }
  }

  return statusOptions;
}

function getSchemaJsonProperties(object: ParsedSchemaJson): string[] {
  const propertiesKeys = Object.keys(
    object.validSchemaJson && object.schemaJson.properties
  );

  const propertiesValues = Object.values(
    object.validSchemaJson && object.schemaJson.properties
  );

  const specificProperties = propertiesValues
    .map((value) => {
      if (value instanceof Object) {
        return Object.keys(value).filter((key) => {
          return key !== 'type' && key !== 'description';
        });
      } else {
        return '';
      }
    })
    .flat()
    .filter((e) => {
      return e !== '';
    });

  const specificPropertiesValues = propertiesValues
    .map((value) => {
      return Object.values(value).map((v) => {
        if (
          v !== 'string' &&
          v !== 'integer' &&
          v !== 'boolean' &&
          v !== 'object' &&
          v !== 'array' &&
          v !== 'number'
        ) {
          return String(v);
        } else {
          return '';
        }
      });
    })
    .flat()
    .filter((e) => {
      return e !== '';
    });

  const searchableAttributes = propertiesKeys.concat(
    specificProperties,
    specificPropertiesValues
  );

  return searchableAttributes;
}

function getSearchFields(extensions: CatalogDataModelExtension[]): string[] {
  const allKeys = extensions.map((extension) => {
    return Object.keys(extension);
  });

  const allKeysFlattened = allKeys.flat();

  return allKeysFlattened.filter((key, index) => {
    return allKeysFlattened.indexOf(key) === index;
  });
}

export default function Extensions(props: PageProps) {
  const router = useRouter();

  const {
    query: { search, industry, publisher, status },
  } = router;

  const [searchState, setSearchState] = useState({
    matchingExtensions: new Array(),
    searchValue: (search as string) || '',
    industry: (industry as string) || '',
    publisher: (publisher as string) || '',
    status: (status as string) || '',
    options: {
      filter: undefined,
    },
  });

  const { allExtensions } = props;

  const extensionSearchIndex: (CatalogDataModelExtension & {
    id: number;
    publisher: string;
  })[] = allExtensions.map((extension, index) => {
    const { validSchemaJson } = extension.parsedSchemaJson;

    return {
      ...extension,
      id: index + 1,
      publisher: extension.author.name,
      schemaJson: getSchemaJsonProperties(extension.parsedSchemaJson),
      // Alternatively, we can simply stringify the whole schema.json
      // schemaJson: JSON.stringify(
      //   validSchemaJson && extension.parsedSchemaJson.schemaJson
      // ),
    };
  });

  let miniSearchExtensions = new MiniSearch({
    fields: getSearchFields(extensionSearchIndex),
    storeFields: [
      'name',
      'version',
      'description',
      'publisher',
      'author',
      'catalog_info',
      'industries',
    ],
  });

  miniSearchExtensions.addAll(extensionSearchIndex);

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

  function handlePublisherChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearchState({
      ...searchState,
      publisher: event.target.value,
    });

    if (event.target.value === '') {
      delete router.query.publisher;
    } else {
      router.query.publisher = event.target.value;
    }
    router.push({
      pathname: router.pathname,
      query: router.query,
    });
  }

  function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearchState({
      ...searchState,
      status: event.target.value,
    });

    if (event.target.value === '') {
      delete router.query.status;
    } else {
      router.query.status = event.target.value;
    }
    router.push({
      pathname: router.pathname,
      query: router.query,
    });
  }

  useEffect(() => {
    const { industry, publisher, status, searchValue } = searchState;

    const matchingExtensions = miniSearchExtensions.search(searchValue, {
      filter: (result: SearchResult) => {
        if (industry !== '' && !result.industries.includes(industry)) {
          return false;
        }
        if (publisher !== '' && publisher !== result.publisher) {
          return false;
        }
        if (status !== '' && status !== result.catalog_info.status) {
          return false;
        }
        return true;
      },
    });

    setSearchState({
      ...searchState,
      matchingExtensions,
    });
  }, [
    searchState.searchValue,
    searchState.industry,
    searchState.publisher,
    searchState.status,
  ]);

  function resetSearch() {
    return (
      <div className="text-right">
        <button
          className="light-blue-secondary-button"
          onClick={() => {
            setSearchState({
              matchingExtensions: new Array(),
              searchValue: '',
              industry: '',
              publisher: '',
              status: '',
              options: {
                filter: undefined,
              },
            });
            router.push('/extensions');
          }}
        >
          {'<'} Reset
        </button>
      </div>
    );
  }
  const filterByIndustry = allExtensions.filter((extension) => {
    return extension.industries.includes(searchState.industry);
  });

  const filterByPublisher = allExtensions.filter((extension) => {
    return extension.author.name === publisher;
  });

  const filterByStatus = allExtensions.filter((extension) => {
    return extension.catalog_info.status === status;
  });

  const filterByIndustryAndPublisher = filterByIndustry.filter((extension) => {
    return extension.author.name === publisher;
  });

  const filterByIndustryAndStatus = filterByIndustry.filter((extension) => {
    return extension.catalog_info.status === status;
  });

  const filterByPublisherAndStatus = filterByPublisher.filter((extension) => {
    return extension.catalog_info.status === status;
  });

  const filterByIndustryAndPublisherAndStatus = filterByIndustry.filter(
    (extension) => {
      return (
        extension.author.name === publisher &&
        extension.catalog_info.status === status
      );
    }
  );

  function displayExtensions() {
    const { searchValue, industry, publisher, status, matchingExtensions } =
      searchState;

    if (searchValue !== '') {
      return (
        <>
          <Cards
            title={`${matchingExtensions.length} ${
              industry !== '' ? `${industry} related` : ''
            } ${
              status !== '' ? status : ''
            } Industry Specific Extension(s) for '${searchValue}'${
              publisher !== '' ? `, from ${publisher}` : ''
            }`}
            cardsContent={matchingExtensions}
            render={extensionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry !== '' && publisher !== '' && status !== '') {
      return (
        <>
          <Cards
            title={`All ${industry} related ${status} Industry Specific Extensions, from ${publisher}`}
            cardsContent={filterByIndustryAndPublisherAndStatus}
            render={extensionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry !== '' && publisher !== '' && status === '') {
      return (
        <>
          <Cards
            title={`All ${industry} related Industry Specific Extensions, from ${publisher}`}
            cardsContent={filterByIndustryAndPublisher}
            render={extensionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry === '' && publisher !== '' && status !== '') {
      return (
        <>
          <Cards
            title={`All ${status} Industry Specific Extensions, from ${publisher}`}
            cardsContent={filterByPublisherAndStatus}
            render={extensionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry !== '' && publisher === '' && status !== '') {
      return (
        <>
          <Cards
            title={`All ${industry} related ${status} Industry Specific Extensions`}
            cardsContent={filterByIndustryAndStatus}
            render={extensionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry !== '' && publisher === '' && status === '') {
      return (
        <>
          <Cards
            title={`All ${industry} related Industry Specific Extensions`}
            cardsContent={filterByIndustry}
            render={extensionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry === '' && publisher !== '' && status === '') {
      return (
        <>
          <Cards
            title={`All ${
              industry !== '' ? `${industry} related` : ''
            } Industry Specific Extensions from ${publisher}`}
            cardsContent={filterByPublisher}
            render={extensionCards}
          />
          {resetSearch()}
        </>
      );
    } else if (industry === '' && publisher === '' && status !== '') {
      return (
        <>
          <Cards
            title={`All ${status} Industry Specific Extensions`}
            cardsContent={filterByStatus}
            render={extensionCards}
          />
          {resetSearch()}
        </>
      );
    } else {
      return (
        <Cards
          title="All Industry Specific Extensions"
          cardsContent={allExtensions}
          render={extensionCards}
        />
      );
    }
  }

  function setIndustryOptions(): FilterOption[] {
    if (publisher === undefined && status === undefined) {
      return getAllIndustries(allExtensions, allExtensions);
    } else if (publisher !== undefined && status === undefined) {
      return getAllIndustries(allExtensions, filterByPublisher);
    } else if (publisher === undefined && status !== undefined) {
      return getAllIndustries(allExtensions, filterByStatus);
    } else {
      return getAllIndustries(allExtensions, filterByPublisherAndStatus);
    }
  }

  function setPublisherOptions(): FilterOption[] {
    if (industry === undefined && status === undefined) {
      return getAllPublishers(allExtensions, allExtensions);
    } else if (industry !== undefined && status === undefined) {
      return getAllPublishers(allExtensions, filterByIndustry);
    } else if (industry === undefined && status !== undefined) {
      return getAllPublishers(allExtensions, filterByStatus);
    } else {
      return getAllPublishers(allExtensions, filterByIndustryAndStatus);
    }
  }

  function setStatusOptions(): FilterOption[] {
    if (industry === undefined && publisher === undefined) {
      return getAllStatuses(allExtensions, allExtensions);
    } else if (industry !== undefined && publisher === undefined) {
      return getAllStatuses(allExtensions, filterByIndustry);
    } else if (industry === undefined && publisher !== undefined) {
      return getAllStatuses(allExtensions, filterByPublisher);
    } else {
      return getAllStatuses(allExtensions, filterByIndustryAndPublisher);
    }
  }

  return (
    <Layout title="Industry Specific Extensions">
      <section>
        <SearchBar
          searchValue={searchState.searchValue}
          onSearchValueChange={handleSearchValueChange}
          firstFilterName="industries"
          firstFilterContent={setIndustryOptions()}
          firstFilterValue={searchState.industry}
          onFirstFilterChange={handleIndustryChange}
          secondFilterName="publishers"
          secondFilterContent={setPublisherOptions()}
          secondFilterValue={searchState.publisher}
          onSecondFilterChange={handlePublisherChange}
          thirdFilterName="statuses"
          thirdFilterContent={setStatusOptions()}
          thirdFilterValue={searchState.status}
          onThirdFilterChange={handleStatusChange}
          title={'Search Industry Specific Extensions'}
          placeholder={
            'e.g. World Business Council for Sustainable Development'
          }
          color={'light-blue'}
        />
      </section>
      <section>{displayExtensions()}</section>
    </Layout>
  );
}
