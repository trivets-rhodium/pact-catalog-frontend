import { getAllExtensions } from '../lib/data-model-extensions';
import { GetStaticProps } from 'next';
import { CatalogDataModelExtension } from '../lib/catalog-types';
import Layout from '../components/layout';
import React, { useEffect } from 'react';
import { Cards, extensionCards } from '../components/cards';
import MiniSearch, { SearchResult } from 'minisearch';
import SearchBar from '../components/search-bar';

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

export default function Extensions(props: PageProps) {
  const [search, setSearch] = React.useState({
    matchingExtensions: new Array(),
    searchValue: '',
    industry: '',
    publisher: '',
    status: '',
    options: {
      filter: undefined,
    },
  });

  const { allExtensions } = props;

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
    fields: ['name', 'version', 'description', 'publisher'],
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

  function handlePublisherChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearch({
      ...search,
      publisher: event.target.value,
    });
  }

  function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearch({
      ...search,
      status: event.target.value,
    });
  }

  useEffect(() => {
    const { industry, publisher, status, searchValue } = search;

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

    setSearch({
      ...search,
      matchingExtensions,
    });
  }, [search.searchValue, search.industry, search.publisher, search.status]);

  function displayExtensions() {
    const { searchValue, industry, publisher, status, matchingExtensions } =
      search;

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
        />
      );
    } else if (industry !== '' && publisher === '' && status === '') {
      return (
        <Cards
          title={`All ${industry} related Data Model Extensions`}
          cardsContent={filterByIndustry}
          render={extensionCards}
        />
      );
    } else if (publisher !== '' && status !== '') {
      return (
        <Cards
          title={`All ${
            industry !== '' ? `${industry} related` : ''
          } ${status} Data Model Extensions, from ${publisher}`}
          cardsContent={filterByPublisherAndStatus}
          render={extensionCards}
        />
      );
    } else if (publisher !== '' && status === '') {
      return (
        <Cards
          title={`All ${
            industry !== '' ? `${industry} related` : ''
          } Data Model Extensions from ${publisher}`}
          cardsContent={filterByPublisher}
          render={extensionCards}
        />
      );
    } else if (industry !== '' && publisher === '' && status !== '') {
      return (
        <Cards
          title={`All ${industry} related ${status} Data Model Extensions`}
          cardsContent={filterByIndustryAndStatus}
          render={extensionCards}
        />
      );
    } else if (publisher === '' && status !== '') {
      return (
        <Cards
          title={`All ${status} Data Model Extensions`}
          cardsContent={filterByStatus}
          render={extensionCards}
        />
      );
    } else {
      return (
        <Cards
          title="All Data Model Extensions"
          cardsContent={allExtensions}
          render={extensionCards}
        />
      );
    }
  }

  return (
    <Layout title="Data Model Extensions">
      <section>
        <SearchBar
          onSearchValueChange={handleSearchValueChange}
          firstFilterName="industries"
          firstFilterContent={getAllIndustries(allExtensions)}
          onFirstFilterChange={handleIndustryChange}
          secondFilterName="publishers"
          secondFilterContent={
            search.industry === ''
              ? getAllPublishers(allExtensions)
              : getPublishersByIndustry(search.industry, allExtensions)
          }
          onSecondFilterChange={handlePublisherChange}
          thirdFilterName="statuses"
          thirdFilterContent={getAllStatuses(allExtensions)}
          onThirdFilterChange={handleStatusChange}
          title={'Search Data Model Extensions'}
          placeholder={
            'e.g. World Business Council for Sustainable Development'
          }
        />
      </section>
      <section>{displayExtensions()}</section>
    </Layout>
  );
}
