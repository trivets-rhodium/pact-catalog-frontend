import Head from 'next/head';
import { getAllExtensions } from '../lib/data-model-extensions';
import { GetStaticProps } from 'next';
import { CatalogDataModelExtension } from '../lib/catalog-types';
import Layout from '../components/layout';
import { getAllSolutions } from '../lib/solutions';
import React, { useEffect } from 'react';
import { Cards, extensionCards, solutionCards } from '../components/cards';
import ExtensionSearchBar from '../components/extension-search-bar';
import MiniSearch, { Options, SearchOptions, SearchResult } from 'minisearch';

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

function getAllStatuses(allExtensions: CatalogDataModelExtension[]) {
  const allStatus = allExtensions.map((extension) => {
    return extension.catalog_info.status;
  });

  // TO DO: include only represented statuses?
  allStatus.push('deprecated');

  return allStatus.filter((status, index) => {
    return allStatus.indexOf(status) === index;
  });
}

type Search = {
  matchingExtensions: SearchResult[];
  searchValue: string;
  publisher: string;
  status: string;
  options: {
    filter: ((result: SearchResult) => boolean) | undefined;
  };
};

export default function Home(props: PageProps) {
  const [search, setSearch] = React.useState<Search>({
    matchingExtensions: new Array(),
    searchValue: '',
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
    ],
  });

  miniSearchExtensions.addAll(extensionSearchIndex);

  function handleSearchValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch({
      ...search,
      searchValue: event.target.value,
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
    const { publisher, status, searchValue } = search;

    const matchingExtensions = miniSearchExtensions.search(searchValue, {
      filter: (result: SearchResult) => {
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
  }, [search.searchValue, search.publisher, search.status]);

  function displayExtensions() {
    const { searchValue, publisher, status, matchingExtensions } = search;

    const filterByPublisher = allExtensions.filter((extension) => {
      return extension.author.name === publisher;
    });

    const filterByStatus = allExtensions.filter((extension) => {
      return extension.catalog_info.status === status;
    });

    const filterByPublisherAndStatus = filterByPublisher.filter((extension) => {
      return extension.catalog_info.status === status;
    });

    if (searchValue !== '') {
      return (
        <Cards
          title="Data Model Extensions"
          subtitle={`Found ${matchingExtensions.length} ${
            status !== '' ? status : ''
          } extensions with '${searchValue}' ${
            publisher !== '' ? `from ${publisher}` : ''
          }`}
          cardsContent={matchingExtensions}
          render={extensionCards}
        />
      );
    } else if (publisher !== '' && status !== '') {
      return (
        <Cards
          title="Data Model Extensions"
          subtitle={`All ${status} extensions, from ${publisher}`}
          cardsContent={filterByPublisherAndStatus}
          render={extensionCards}
        />
      );
    } else if (publisher !== '' && status === '') {
      return (
        <Cards
          title="Data Model Extensions"
          subtitle={`All extensions from ${publisher}`}
          cardsContent={filterByPublisher}
          render={extensionCards}
        />
      );
    } else if (publisher === '' && status !== '') {
      return (
        <Cards
          title="Data Model Extensions"
          subtitle={`All ${status} extensions`}
          cardsContent={filterByStatus}
          render={extensionCards}
        />
      );
    } else {
      return (
        <Cards
          title="Data Model Extensions"
          subtitle="All extensions"
          cardsContent={allExtensions}
          render={extensionCards}
        />
      );
    }
  }

  return (
    <Layout title="Data Model Extensions">
      <section>
        <ExtensionSearchBar
          onSearchValueChange={handleSearchValueChange}
          publishers={getAllPublishers(allExtensions)}
          onPublisherChange={handlePublisherChange}
          statuses={getAllStatuses(allExtensions)}
          onStatusChange={handleStatusChange}
        />
      </section>

      <section>{displayExtensions()}</section>
    </Layout>
  );
}
