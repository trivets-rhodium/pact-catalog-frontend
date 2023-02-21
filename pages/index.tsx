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
    <section className="grid grid-cols-10 h-screen">
      <div className="dark-background background-shadow col-span-4 flex flex-col justify-between">
        <div className="flex justify-between items-center mx-4">
          <a
            href={'https://carbon-transparency.com'}
            target="_blank"
            rel="noreferrer"
          >
            <Image src={pactLogo} alt={'PACT logo'} />
          </a>
          <div className="mr-10">
            <a href="https://sine.foundation" target="_blank" rel="noreferrer">
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
            Find and create industry specific Scope-3 data extensions — and the
            software solutions that support these
          </p>
          <h3 className="text-white">Partners and Contributors:</h3>
          <Marquee gradient={false} speed={20} pauseOnHover>
            <LogoMarquee />
          </Marquee>
        </div>
      </div>
      <div className="background-image col-span-6 flex justify-center items-center">
        <div className="h-full min-w-full relative ">
          <Hexagon
            svgPath="/hexagons/white-hexagon.svg"
            className="mt-20 absolute top-0 left-1/4 hexagon-shadow white-hexagon"
            mainText="Data Model Extensions"
            secondaryText="Industry-specific extensions to the PACT methodology"
            href="/extensions"
          />
          <Hexagon
            svgPath="/hexagons/blue-hexagon.svg"
            className="mt-20 absolute top-1/4 left-2/4 hexagon-shadow blue-hexagon"
            mainText="PACT Compliant Solutions"
            secondaryText="Software solutions that conform with the Pathfinder technical specifications"
            href="/solutions"
          />
          <Hexagon
            svgPath="/hexagons/green-hexagon.svg"
            className="mt-20 absolute top-2/4 left-1/4 hexagon-shadow green-hexagon"
            mainText="Members"
            secondaryText="The Online Catalog and its Members"
            // TO DO: Replace with members index href
            href="/working-groups"
          />

          <Link
            href={'/about'}
            className="about-button absolute bottom-6 right-8"
          >
            <h3>?</h3>
          </Link>
        </div>
      </div>
    </section>
  );
}
