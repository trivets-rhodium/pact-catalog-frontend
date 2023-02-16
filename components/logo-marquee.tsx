import Image from 'next/image';

type Logos = {
  fileName: string;
  alt: string;
  margin: string;
  padding?: string;
  size: number;
}[];

const logos: Logos = [
  {
    fileName: 'wbcsd-logo.svg',
    alt: 'WBCSD logo',
    margin: 'mx-4',
    size: 100,
  },
  {
    fileName: 'siemens-logo.svg',
    alt: 'Siemens logo',
    margin: 'mx-4',
    size: 100,
  },
  {
    fileName: 'catena-x-logo.svg',
    alt: 'Catena-x logo',
    margin: 'mx-4',
    size: 100,
  },
  {
    fileName: 'mckinsey-logo.svg',
    alt: 'McKinsey Sustainability logo',
    margin: 'mx-4',
    size: 100,
  },
  {
    fileName: 'ecovadis-logo.svg',
    alt: 'Ecovadis logo',
    margin: 'mx-4',
    size: 100,
  },
  {
    fileName: 'unilever-logo.svg',
    alt: 'Unilever logo',
    margin: 'mx-0',
    padding: 'p-2',
    size: 100,
  },
  {
    fileName: 'ibm-logo.svg',
    alt: 'IBM logo',
    margin: 'mx-0',
    size: 100,
  },
  {
    fileName: 'microsoft-logo.svg',
    alt: 'Microsoft logo',
    margin: 'mx-0',
    size: 150,
  },
  {
    fileName: 'together-for-sustainability-logo.svg',
    alt: 'Together for Sustainability logo',
    margin: 'mx-2',
    size: 150,
  },
  {
    fileName: 'rmi-logo.svg',
    alt: 'Rocky Mountain Institute logo',
    margin: 'mx-4',
    size: 100,
  },
  {
    fileName: 'sfc-logo.svg',
    alt: 'Smart Freight Center logo',
    margin: 'mx-4',
    size: 100,
  },
  {
    fileName: 'jeita-logo.svg',
    alt: 'JEITA logo',
    margin: 'mx-4',
    size: 80,
  },
];

export function LogoMarquee() {
  return (
    <>
      {logos.map(({ fileName, alt, margin, padding, size }) => {
        return (
          <Image
            src={`/logos/${fileName}`}
            alt={alt}
            className={`${margin} ${padding}`}
            height={size}
            width={size}
          />
        );
      })}
    </>
  );
}
