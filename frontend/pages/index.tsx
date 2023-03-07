import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import pactLogo from '../public/logos/pact-logo.svg';
import Link from 'next/link';
import { Footer } from '../components/footer';
import { Hexagon } from '../components/hexagons';
import sineLogo from '../public/logos/sine-logo-white.svg';
import Marquee from 'react-fast-marquee';
import { LogoMarquee } from '../components/logo-marquee';
import Head from 'next/head';

export default function Home() {
  const [marqueeSeed, _setMarqueeSeed] = useState(
    Math.floor(Math.random() * 100)
  );

  return (
    <>
      <Head>
        <title>PACT Online Catalog</title>
      </Head>
      <section className="grid grid-cols-10 h-screen">
        <div className="dark-background background-shadow col-span-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mx-4">
            <a
              href={'https://carbon-transparency.com'}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src={pactLogo}
                alt={'PACT logo'}
                className="hover:opacity-70"
              />
            </a>
            <div className="mr-10">
              <a
                href="https://sine.foundation"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={sineLogo}
                  alt={'SINE logo'}
                  priority
                  width={180}
                  className="hover:opacity-70"
                />
              </a>
            </div>
          </div>
          <div className="mx-14 mb-6">
            <div className="my-28">
              <h1 className="text-white leading-tight mb-8">
                PACT Online Catalog
              </h1>

              <p className="text-white mb-20 leading-8">
                Explore{' '}
                <Link
                  className="link-background-1 hover:opacity-70"
                  href={'/solutions'}
                >
                  PACT conforming solutions
                </Link>{' '}
                for exchanging Scope-3 carbon footprint data. Find and
                contribute{' '}
                <Link
                  className="link-background-2 hover:opacity-70"
                  href={'/extensions'}
                >
                  industry specific extensions
                </Link>{' '}
                to the PACT Data Model. Discover{' '}
                <Link
                  className="link-background-3 hover:opacity-70"
                  href={'/collaborators'}
                >
                  our collaborators
                </Link>
                .
              </p>
            </div>
            <p className="text-white text-sm">Partners & Contributors</p>
            <Marquee gradient={false} speed={15} pauseOnHover>
              <LogoMarquee seed={marqueeSeed} />
            </Marquee>
            <Marquee gradient={false} speed={20} pauseOnHover>
              <LogoMarquee seed={marqueeSeed} reverse />
            </Marquee>
          </div>
        </div>
        <div className="background-image col-span-5 flex justify-center items-center">
          <div className="w-7/12 h-5/6 flex justify-center relative">
            <img
              src={'/hexagons/hex-1.svg'}
              className="absolute top-0 left-0 hexagon-shadow"
            />
            <Hexagon
              svgPath="/hexagons/hex-1.svg"
              className=" absolute top-0 left-0 hexagon-clip"
              mainText="PACT Conforming Solutions"
              secondaryText="that conform to the PACT Technical Specifications"
              href="/solutions"
            />
            <img
              src={'/hexagons/hex-2.svg'}
              className="absolute right-0 top-1/2 -translate-y-1/2 hexagon-shadow"
            />
            <Hexagon
              svgPath="/hexagons/hex-2.svg"
              className="absolute right-0 top-1/2 -translate-y-1/2 hexagon-clip"
              mainText="Industry Specific Extensions"
              secondaryText="to the PACT product carbon footprint Data Model"
              href="/extensions"
            />
            <img
              src={'/hexagons/hex-3.svg'}
              className=" absolute bottom-0 left-0 hexagon-shadow"
            />
            <Hexagon
              svgPath="/hexagons/hex-3.svg"
              className=" absolute bottom-0 left-0 hexagon-clip"
              mainText="Collaborators"
              secondaryText="who participate in the PACT initiative"
              href="/collaborators"
            />
          </div>
          <Link
            href={'/about'}
            className="about-button absolute bottom-6 right-8"
          >
            <h3>?</h3>
          </Link>
        </div>
      </section>
    </>
  );
}
