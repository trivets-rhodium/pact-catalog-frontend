import Image from 'next/image';
import { useState } from 'react';

type Logos = {
  fileName: string;
  alt: string;
  margin: string;
  padding?: string;
  size: number;
  link: string;
}[];

const logos: Logos = [
  {
    fileName: 'wbcsd-logo.svg',
    alt: 'WBCSD logo',
    margin: 'mx-2',
    size: 100,
    link: 'https://www.wbcsd.org/',
  },
  {
    fileName: 'siemens-logo.svg',
    alt: 'Siemens logo',
    margin: 'mx-2',
    size: 100,
    link: 'https://www.siemens.com/',
  },
  {
    fileName: 'catena-x-logo.svg',
    alt: 'Catena-x logo',
    margin: 'mx-2',
    size: 100,
    link: 'https://catena-x.net/',
  },
  {
    fileName: 'mckinsey-logo.svg',
    alt: 'McKinsey Sustainability logo',
    margin: 'mx-2',
    size: 100,
    link: 'https://www.mckinsey.com/capabilities/sustainability/how-we-help-clients',
  },
  {
    fileName: 'ecovadis-logo.svg',
    alt: 'Ecovadis logo',
    margin: 'mx-2',
    size: 100,
    link: 'https://ecovadis.com/',
  },
  {
    fileName: 'unilever-logo.svg',
    alt: 'Unilever logo',
    margin: 'mx-0',
    padding: 'p-2',
    size: 100,
    link: 'https://www.unilever.com/',
  },
  {
    fileName: 'ibm-logo.svg',
    alt: 'IBM logo',
    margin: 'mx-0',
    size: 100,
    link: 'https://www.ibm.com/',
  },
  {
    fileName: 'microsoft-logo.svg',
    alt: 'Microsoft logo',
    margin: 'mx-0',
    size: 150,
    link: 'https://www.microsoft.com/',
  },
  {
    fileName: 'together-for-sustainability-logo.svg',
    alt: 'Together for Sustainability logo',
    margin: 'mx-2',
    size: 150,
    link: 'https://www.tfs-initiative.com/',
  },
  {
    fileName: 'rmi-logo.svg',
    alt: 'Rocky Mountain Institute logo',
    margin: 'mx-2',
    size: 100,
    link: 'https://rmi.org/',
  },
  {
    fileName: 'sfc-logo.svg',
    alt: 'Smart Freight Center logo',
    margin: 'mx-2',
    size: 100,
    link: 'https://www.smartfreightcentre.org/',
  },
  {
    fileName: 'jeita-logo.svg',
    alt: 'JEITA logo',
    margin: 'mx-2',
    size: 80,
    link: 'https://www.jeita.or.jp/',
  },
];

function pickElements(seed: number, reverse?: boolean): Logos {
  let rearrangedLogos = [];

  for (let index = 0; index < logos.length; index++) {
    const element = logos[(seed + index) % logos.length];

    rearrangedLogos.push(element);
  }

  if (reverse) {
    return rearrangedLogos.reverse();
  }
  return rearrangedLogos;
}

export function LogoMarquee(props: { seed: number; reverse?: boolean }) {
  const marqueeLogos = pickElements(props.seed, props.reverse);

  return (
    <>
      {marqueeLogos.map(({ fileName, alt, margin, padding, size, link }) => {
        console.log(fileName);
        return (
          <a key={fileName} href={link} target="_blank">
            <Image
              src={`/logos/${fileName}`}
              alt={alt}
              className={`${margin} ${padding}`}
              priority
              width={0}
              height={0}
              style={{ width: 'auto', height: 'auto' }}
            />
          </a>
        );
      })}
    </>
  );
}
