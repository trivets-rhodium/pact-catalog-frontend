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

type IndexLayoutProps = {
  title: string;
  children: React.ReactNode;
};

function IndexLayout(props: IndexLayoutProps) {
  const { title, children } = props;
  return (
    <section className="background pb-10 rounded-sm">
      <h2 className="title px-4">{title}</h2>
      <ul className="grid grid-cols-3">{children}</ul>
    </section>
  );
}

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

export type SearchableCatalogDataModelExtension = {
  id: number;
  author: {
    name: string;
    email: string;
    url: string;
  };
  name: string;
  version: string;
  description: string;
  catalog_info: {
    summary: string | null;
    status: 'published' | 'draft' | 'deprecated';
    authors: string[];
  };
};

export default function Home(props: PageProps) {
  const [searchType, setSearchType] = React.useState('dataModelExtensions');
  const [search, setSearch] = React.useState('');

  const { latestExtensions, allConformingSolutions, allExtensions } = props;

  const extensionIndex: SearchableCatalogDataModelExtension[] =
    allExtensions.map((extension, index) => {
      return {
        id: index + 1,
        author: extension.author,
        name: extension.name,
        version: extension.version,
        description: extension.description,
        catalog_info: extension.catalog_info,
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

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (searchType === 'dataModelExtensions') {
      searchExtensions(event.target.value);
    } else {
      searchSolutions(event.target.value);
    }
    setSearch(event.target.value);
  }

  function handleSearchTypeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const checked = target.checked;

    if (checked) {
      setSearchType(target.value);
    }
  }


  return (
    <Layout>
      <div>
        <label htmlFor="searchBar">Search</label>
        <input name="searchBar" type="text" onChange={handleSearchChange} />
        <fieldset>
          <legend>Type</legend>
          <label htmlFor="dataModelExtensions">Data Model Extensions</label>
          <input
            type="radio"
            name="type"
            value="dataModelExtensions"
            checked={searchType === 'dataModelExtensions'}
            onChange={handleSearchTypeChange}
          />
          <label htmlFor="conformingSolutions">Conforming Solutions</label>
          <input
            type="radio"
            name="type"
            value="conformingSolutions"
            onChange={handleSearchTypeChange}
          />
        </fieldset>
      </div>
      {!searchExtensionsResults || !searchExtensionsResults.length ? (
        <Cards
          title="Latest Data Model Extensions"
          cardsContent={latestExtensions}
          render={extensionCards}
        ></Cards>
      ) : (
        <Cards
          title={`Searching Data Model Extensions with '${search}'`}
          cardsContent={searchExtensionsResults}
          render={extensionCards}
        />
      )}
      {!searchSolutionsResults || !searchSolutionsResults.length ? (
        <Cards
          title="All Conforming Solutions"
          cardsContent={allConformingSolutions}
          render={solutionCards}
        />
      ) : (
        <Cards
          title={`Searching Conforming Solutions with '${search}'`}
          cardsContent={searchSolutionsResults}
          render={solutionCards}
        />
      )}
    </Layout>
  );
}
