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
import Image from 'next/image';
import pactLogo from '../public/pact-logo.svg';
import { PactLogo, PartnersLogos, SineLogo } from '../components/logos';
// import {
//   BlueHexagon,
//   GreenHexagon,
//   WhiteHexagon,
// } from '../components/hexagons';
import Link from 'next/link';
import { Footer } from '../components/footer';
import { Hexagon } from '../components/hexagons';

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
    console.log('extension.schemaJson', extension.parsedSchemaJson);
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
    // <Layout title="Online Catalog">
    //   <section>
    //     <SearchBar
    //       title="Search the Catalog"
    //       placeholder="Search Data Model Extensions and Conforming Solutions"
    //       onSearchValueChange={handleSearchValueChange}
    //     />
    //   </section>

    //   {!searchTrigger ? (
    //     <section>
    //       <Cards
    //         title="Data Model Extensions"
    //         href="/extensions"
    //         message={generateMessage(allExtensions, 'extension')}
    //         cardsContent={latestExtensions.slice(0, cols - 1)}
    //         render={extensionCards}
    //       />

    //       <Cards
    //         title="Conforming Solutions"
    //         href="/solutions"
    //         message={generateMessage(allSolutions, 'solution')}
    //         cardsContent={allSolutions.slice(0, cols - 1)}
    //         render={solutionCards}
    //       />
    //     </section>
    //   ) : (
    //     <section>
    //       <Cards
    //         title={`${matchingExtensions.length} Data Model Extension(s) for '${searchValue}'`}
    //         href="/extensions"
    //         message={generateMessage(matchingExtensions, 'extension')}
    //         cardsContent={matchingExtensions.slice(0, cols - 1)}
    //         render={extensionCards}
    //       />

    //       <Cards
    //         title={`${matchingSolutions.length} Conforming Solution(s) for '${searchValue}'`}
    //         href="/solutions"
    //         message={generateMessage(matchingSolutions, 'solution')}
    //         cardsContent={matchingSolutions.slice(0, cols - 1)}
    //         render={solutionCards}
    //       />
    //     </section>
    //   )}
    // </Layout>
    <div>
      <section className="grid grid-cols-10 min-h-screen">
        <div className="dark-background col-span-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mx-4">
            <PactLogo />
            <div className="mr-10">
              <SineLogo />
            </div>
          </div>
          <div className="mx-14 mb-12">
            <div className="mb-4">
              <h1 className="text-white">
                PACT <br />
                Online Catalog
              </h1>
              <p className="text-white">Powered by SINE Foundation</p>
            </div>
            <p className="text-white mb-20">
              Find and create industry specific Scope-3 data extensions — and
              the software solutions that support these
            </p>
            <h3 className="text-white">Partners and Contributors:</h3>
            <PartnersLogos />
          </div>
        </div>
        <div className="background-image col-span-5 flex justify-center items-center">
          <div className="min-h-full min-w-full relative mt-36">
            <Hexagon
              className="absolute top-0 left-1/4"
              hexagonColor="white-hexagon"
              mainText="Data Model Extensions"
              secondaryText="Industry-specific extensions to the PACT methodology"
              href="/extensions"
            />
            <Hexagon
              className="absolute top-1/4 left-2/4"
              hexagonColor="blue-hexagon"
              mainText="Conforming Solutions"
              secondaryText="Software solutions that conform with the Pathfinder technical specifications"
              href="/solutions"
            />
            <Hexagon
              className="absolute top-2/4 left-1/4"
              hexagonColor="green-hexagon"
              mainText="Members"
              secondaryText="The Online Catalog and its Members"
              // TO DO: Replace with members index href
              href="/working-groups"
            />
            {/* <WhiteHexagon
              classes="absolute top-0 left-1/4"
              title="Data Model Extensions"
              description="Industry-specific data extensions to add to your PACT methodology"
              href="/extensions"
            />
            <BlueHexagon
              classes="absolute top-1/4 left-2/4"
              title="Conforming Solutions"
              description="Browse software solutions that conform to the Pathfinder Network specification"
              href="/solutions"
            />
            <GreenHexagon
              classes="absolute top-2/4 left-1/4"
              title="Members"
              description="Learn more about the Online Catalog and its Members"
              // TO DO: Replace with members index href
              href="/working-groups"
            /> */}
          </div>
        </div>
      </section>
      <section className="mt-24 min-h-screen">
        <h1 className="mx-16">About the PACT Online Catalog</h1>
        <div className="grid grid-cols-3 gap-1">
          <p className="col-span-1 ml-16 my-12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            odio nunc, placerat ut pellentesque ut, pharetra non risus. Interdum
            et malesuada fames ac ante ipsum primis in faucibus. Suspendisse
            vitae justo vel felis bibendum malesuada non vel est. Morbi
            ullamcorper vel sapien et commodo. Vestibulum massa est, rhoncus
            vitae quam quis, scelerisque consectetur velit. Sed urna justo,
            condimentum vel leo feugiat, efficitur scelerisque risus.
          </p>
          <iframe
            className="col-span-2 pr-16 p-12"
            width="980"
            height="551"
            src="https://www.youtube.com/embed/9e45s7-CeaY"
            title="This new PACT is helping companies fight Scope 3 emissions"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        <div className="flex justify-center mt-12">
          <Hexagon
            className="mx-2"
            hexagonColor="white-hexagon"
            mainText="Data Model Extensions"
            small
            href="/extensions"
          />
          <Hexagon
            className="mx-2"
            hexagonColor="blue-hexagon"
            mainText="Conforming Solutions"
            small
            href="/solutions"
          />
          <Hexagon
            className="mx-2"
            hexagonColor="green-hexagon"
            mainText="Members"
            small
            // TO DO: Replace with members index href
            href="/working-groups"
          />
          {/* <WhiteHexagon
            classes="mx-2"
            title="Data Model Extensions"
            href="/extensions"
            small={true}
          />
          <BlueHexagon
            classes="mx-2"
            title="Conforming Solutions"
            href="/solutions"
            small={true}
          />
          <GreenHexagon
            classes="mx-2"
            title="Members"
            // TO DO: Replace with members index href
            href="/working-groups"
            small={true}
          /> */}
        </div>
      </section>
      <section className="m-24 min-h-screen">
        <div>
          <div className="flex items-center mb-32">
            {/* <WhiteHexagon title="Data Model Extensions" href="/extensions" /> */}
            <Hexagon
              className="shrink-0"
              hexagonColor="white-hexagon"
              mainText="Data Model Extensions"
              href="/extensions"
            />
            <div className="text-blue mx-10">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent odio nunc, placerat ut pellentesque ut, pharetra non
                risus. Interdum et malesuada fames ac ante ipsum primis in
                faucibus. Suspendisse vitae justo vel felis bibendum malesuada
                non vel est. Morbi ullamcorper vel sapien et commodo. Vestibulum
                massa est, rhoncus vitae quam quis, scelerisque consectetur
                velit. Sed urna justo, condimentum vel leo feugiat, efficitur
                scelerisque risus.
              </p>
              <div className="text-right underline">
                <Link href="/extensions">Learn more</Link>
              </div>
            </div>
          </div>
          <div className="flex items-center mb-32">
            <div className="text-blue mx-10">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent odio nunc, placerat ut pellentesque ut, pharetra non
                risus. Interdum et malesuada fames ac ante ipsum primis in
                faucibus. Suspendisse vitae justo vel felis bibendum malesuada
                non vel est. Morbi ullamcorper vel sapien et commodo. Vestibulum
                massa est, rhoncus vitae quam quis, scelerisque consectetur
                velit. Sed urna justo, condimentum vel leo feugiat, efficitur
                scelerisque risus.
              </p>
              <div className="text-right underline">
                <Link href="/extensions">Learn more</Link>
              </div>
            </div>
            {/* <BlueHexagon title="Conforming Solutions" href="/solutions" /> */}
            <Hexagon
              className="shrink-0"
              hexagonColor="blue-hexagon"
              mainText="Conforming Solutions"
              href="/solutions"
            />
          </div>
          <div className="flex items-center mb-32">
            {/* <GreenHexagon
              title="Members"
              // TO DO: Replace with members index href
              href="/working-groups"
            /> */}
            <Hexagon
              className="shrink-0"
              hexagonColor="green-hexagon"
              mainText="Members"
              // TO DO: Replace with members index href
              href="/working-groups"
            />
            <div className="text-blue mx-10">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent odio nunc, placerat ut pellentesque ut, pharetra non
                risus. Interdum et malesuada fames ac ante ipsum primis in
                faucibus. Suspendisse vitae justo vel felis bibendum malesuada
                non vel est. Morbi ullamcorper vel sapien et commodo. Vestibulum
                massa est, rhoncus vitae quam quis, scelerisque consectetur
                velit. Sed urna justo, condimentum vel leo feugiat, efficitur
                scelerisque risus.
              </p>
              <div className="text-right underline">
                <Link href="/extensions">Learn more</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
