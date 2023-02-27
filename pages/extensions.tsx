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
import SearchBar from '../components/search-bar';
import { useRouter } from 'next/router';
import { unknown } from 'zod';

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
  allExtensions: CatalogDataModelExtension[]
): string[] {
  const allIndustries = allExtensions.map((extension) => {
    return extension.industries;
  });

  const industries = allIndustries.flat();

  return industries.filter((industry, index) => {
    return industries.indexOf(industry) === index;
  });
}

function getAllPublishers(
  allExtensions: CatalogDataModelExtension[]
): string[] {
  const allAuthorsNames = allExtensions.map((extension) => {
    return extension.author.name;
  });

  return allAuthorsNames.filter((name, index) => {
    return allAuthorsNames.indexOf(name) === index;
  });
}

function getPublishersByIndustry(
  industry: string,
  allExtensions: CatalogDataModelExtension[]
): string[] {
  const filteredExtensions = allExtensions.filter((extension) => {
    return extension.industries.includes(industry);
  });

  const filteredAuthorsNames = filteredExtensions.map((extension) => {
    return extension.author.name;
  });

  return filteredAuthorsNames.filter((name, index) => {
    return filteredAuthorsNames.indexOf(name) === index;
  });
}

function getAllStatuses(allExtensions: CatalogDataModelExtension[]): string[] {
  const allStatuses = allExtensions.map((extension) => {
    return extension.catalog_info.status;
  });

  // TO DO: include only represented statuses?
  allStatuses.push('deprecated');

  return allStatuses.filter((status, index) => {
    return allStatuses.indexOf(status) === index;
  });
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
      publisher: '',
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
        <button className="secondary-button" onClick={() => router.reload()}>
          {'<'} Reset
        </button>
      </div>
    );
  }

  function displayExtensions() {
    const { searchValue, industry, publisher, status, matchingExtensions } =
      searchState;

    const filterByIndustry = allExtensions.filter((extension) => {
      return extension.industries.includes(industry);
    });

    const filterByPublisher = allExtensions.filter((extension) => {
      return extension.author.name === publisher;
    });

    const filterByStatus = allExtensions.filter((extension) => {
      return extension.catalog_info.status === status;
    });

    const filterByIndustryAndStatus = filterByIndustry.filter((extension) => {
      return extension.catalog_info.status === status;
    });

    const filterByPublisherAndStatus = filterByPublisher.filter((extension) => {
      return extension.catalog_info.status === status;
    });

    if (searchValue !== '') {
      return (
        <>
          <Cards
            title={`${matchingExtensions.length} ${
              industry !== '' ? `${industry} related` : ''
            } ${
              status !== '' ? status : ''
            } Data Model Extension(s) for '${searchValue}'${
              publisher !== '' ? `, from ${publisher}` : ''
            }`}
            cardsContent={matchingExtensions}
            render={extensionCards}
            cardStyle={'light-blue-green'}
          />
          {resetSearch()}
        </>
      );
    } else if (industry !== '' && publisher === '' && status === '') {
      return (
        <>
          <Cards
            title={`All ${industry} related Data Model Extensions`}
            cardsContent={filterByIndustry}
            render={extensionCards}
            cardStyle={'light-blue-green'}
          />
          {resetSearch()}
        </>
      );
    } else if (publisher !== '' && status !== '') {
      return (
        <>
          <Cards
            title={`All ${
              industry !== '' ? `${industry} related` : ''
            } ${status} Data Model Extensions, from ${publisher}`}
            cardsContent={filterByPublisherAndStatus}
            render={extensionCards}
            cardStyle={'light-blue-green'}
          />
          {resetSearch()}
        </>
      );
    } else if (publisher !== '' && status === '') {
      return (
        <>
          <Cards
            title={`All ${
              industry !== '' ? `${industry} related` : ''
            } Data Model Extensions from ${publisher}`}
            cardsContent={filterByPublisher}
            render={extensionCards}
            cardStyle={'light-blue-green'}
          />
          {resetSearch()}
        </>
      );
    } else if (industry !== '' && publisher === '' && status !== '') {
      return (
        <>
          <Cards
            title={`All ${industry} related ${status} Data Model Extensions`}
            cardsContent={filterByIndustryAndStatus}
            render={extensionCards}
            cardStyle={'light-blue-green'}
          />
          {resetSearch()}
        </>
      );
    } else if (publisher === '' && status !== '') {
      return (
        <>
          <Cards
            title={`All ${status} Data Model Extensions`}
            cardsContent={filterByStatus}
            render={extensionCards}
            cardStyle={'light-blue-green'}
          />
          {resetSearch()}
        </>
      );
    } else {
      return (
        <Cards
          title="All Data Model Extensions"
          cardsContent={allExtensions}
          render={extensionCards}
          cardStyle={'light-blue-green'}
        />
      );
    }
  }

  return (
    <Layout title="Data Model Extensions">
      <section>
        <SearchBar
          searchValue={searchState.searchValue}
          onSearchValueChange={handleSearchValueChange}
          firstFilterName="industries"
          firstFilterContent={getAllIndustries(allExtensions)}
          firstFilterValue={searchState.industry}
          onFirstFilterChange={handleIndustryChange}
          secondFilterName="publishers"
          secondFilterContent={
            searchState.industry === ''
              ? getAllPublishers(allExtensions)
              : getPublishersByIndustry(searchState.industry, allExtensions)
          }
          secondFilterValue={searchState.publisher}
          onSecondFilterChange={handlePublisherChange}
          thirdFilterName="statuses"
          thirdFilterContent={getAllStatuses(allExtensions)}
          thirdFilterValue={searchState.status}
          onThirdFilterChange={handleStatusChange}
          title={'Search Data Model Extensions'}
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
