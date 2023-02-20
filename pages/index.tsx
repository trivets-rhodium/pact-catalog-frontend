import React, { useEffect } from 'react';
import Image from 'next/image';
import pactLogo from '../public/logos/pact-logo.svg';
import Link from 'next/link';
import { Footer } from '../components/footer';
import { Hexagon } from '../components/hexagons';
import sineLogo from '../public/logos/sine-logo.svg';
import Marquee from 'react-fast-marquee';
import { LogoMarquee } from '../components/logo-marquee';

export default function Home() {
  return (
    <div className="light-background">
      <section className="grid grid-cols-10 min-h-screen shadow-xl">
        <div className="dark-background background-shadow col-span-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mx-4">
            <a href={'https://carbon-transparency.com'} target="_blank">
              <Image src={pactLogo} alt={'PACT logo'} />
            </a>
            <div className="mr-10">
              <a href="https://sine.foundation" target="_blank">
                <Image src={sineLogo} alt={'SINE logo'} priority width={180} />
              </a>
            </div>
          </div>
          <div className="mx-14 mb-6">
            <div className="mb-4">
              <h1 className="text-white">
                PACT <br />
                Online Catalog
              </h1>
              <p className="text-white">
                Powered by{' '}
                <a
                  href="https://sine.foundation"
                  className="underline underline-offset-4"
                >
                  SINE Foundation
                </a>
              </p>
            </div>
            <p className="text-white mb-20">
              Find and create industry specific Scope-3 data extensions — and
              the software solutions that support these
            </p>
            <h3 className="text-white">Partners and Contributors:</h3>
            <Marquee gradient={false} speed={50} pauseOnHover>
              <LogoMarquee />
            </Marquee>
          </div>
        </div>
        <div className="background-image col-span-5 flex justify-center items-center">
          <div className="min-h-full min-w-full relative mt-36">
            <Hexagon
              svgPath="/hexagons/white-hexagon.svg"
              className="absolute top-0 left-1/4 hexagon-shadow text-blue"
              mainText="Data Model Extensions"
              secondaryText="Industry-specific extensions to the PACT methodology"
              href="/extensions"
            />
            <Hexagon
              svgPath="/hexagons/blue-hexagon.svg"
              className="absolute top-1/4 left-2/4 hexagon-shadow text-white"
              mainText="PACT Compliant Solutions"
              secondaryText="Software solutions that conform with the Pathfinder technical specifications"
              href="/solutions"
            />
            <Hexagon
              svgPath="/hexagons/green-hexagon.svg"
              className="absolute top-2/4 left-1/4 hexagon-shadow text-white"
              mainText="Members"
              secondaryText="The Online Catalog and its Members"
              // TO DO: Replace with members index href
              href="/working-groups"
            />
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
        <div className="flex justify-center  mt-12 ">
          <Hexagon
            svgPath="/hexagons/small-white-hexagon.svg"
            className="text-blue"
            mainText="Data Model Extensions"
            small
            href="/extensions"
          />
          <Hexagon
            svgPath="/hexagons/small-blue-hexagon.svg"
            className="text-white"
            mainText="PACT Compliant Solutions"
            small
            href="/solutions"
          />
          <Hexagon
            svgPath="/hexagons/small-green-hexagon.svg"
            className="text-white"
            mainText="Members"
            small
            // TO DO: Replace with members index href
            href="/working-groups"
          />
        </div>
      </section>
      <section className=" min-h-screen">
        <div className="m-24">
          <div className="flex items-center mb-32">
            <Hexagon
              svgPath="/hexagons/white-hexagon.svg"
              className="shrink-0 text-blue"
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
            <Hexagon
              svgPath="/hexagons/blue-hexagon.svg"
              className="shrink-0 text-white"
              mainText="PACT Compliant Solutions"
              href="/solutions"
            />
          </div>
          <div className="flex items-center mb-32">
            <Hexagon
              svgPath="/hexagons/green-hexagon.svg"
              className="shrink-0 text-white"
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
