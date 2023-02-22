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
      <div className="dark-background background-shadow col-span-5 flex flex-col justify-between">
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
          <div className="my-28">
            <h1 className="text-white leading-tight">PACT Online Catalog</h1>
            <p className="text-white text-sm mb-8">
              by{' '}
              <a
                href="https://sine.foundation"
                className="underline underline-offset-4"
              >
                SINE Foundation
              </a>
            </p>

            <p className="text-white mb-20">
              Explore{' '}
              <span className="green-background">
                PACT conforming solutions
              </span>{' '}
              for exchanging Scope-3 carbon footprint data. Find and contribute{' '}
              <span className="green-background">
                industry specific extensions
              </span>{' '}
              to the PACT Data Model. Discover{' '}
              <span className="green-background">participating members</span>.
            </p>
          </div>
          <p className="text-white text-sm">Partners & Contributors</p>
          <Marquee gradient={false} speed={15} pauseOnHover>
            <LogoMarquee />
          </Marquee>
          <Marquee gradient={false} speed={20} pauseOnHover>
            <LogoMarquee />
          </Marquee>
        </div>
      </div>
      <div className="background-image col-span-5 flex justify-center items-center">
        <div className="h-full min-w-full relative ">
          <img
            src={'/hexagons/green-hexagon.svg'}
            alt={'PACT Compliant Solutions'}
            className="mt-20 absolute top-0 left-1/4 hexagon-shadow"
          />
          <Hexagon
            svgPath="/hexagons/green-hexagon.svg"
            className="mt-20 absolute top-0 left-1/4 green-hexagon hexagon-clip "
            mainText="PACT Compliant Solutions"
            secondaryText="that conform to the PACT Technical Specifications"
            href="/solutions"
          />
          <img
            src={'/hexagons/green-hexagon.svg'}
            alt={'PACT Compliant Solutions'}
            className="mt-20 absolute top-1/4 left-2/4 green-hexagon hexagon-shadow"
          />
          <Hexagon
            svgPath="/hexagons/green-hexagon.svg"
            className="mt-20 absolute top-1/4 left-2/4 green-hexagon hexagon-clip"
            mainText="Industry Specific Extensions"
            secondaryText="to the PACT product carbon footprint Data Model"
            href="/extensions"
          />
          <img
            src={'/hexagons/green-hexagon.svg'}
            alt={'PACT Compliant Solutions'}
            className="mt-20 absolute top-2/4 left-1/4 green-hexagon hexagon-shadow"
          />
          <Hexagon
            svgPath="/hexagons/green-hexagon.svg"
            className="mt-20 absolute top-2/4 left-1/4 green-hexagon hexagon-clip"
            mainText="Members"
            secondaryText="who contribute to the PACT Online Catalog"
            href="/members"
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
