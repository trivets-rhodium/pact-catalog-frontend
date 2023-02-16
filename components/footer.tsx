import SineLogo from '../public/logos/sine-logo.svg';
import Image from 'next/image';

export function Footer() {
  return (
    <div className="w-screen dark-background flex justify-between py-2 px-4 ">
      <p className="text-white">
        PACT Online Catalog — Powered by SINE Foundation
      </p>
      <a href="https://sine.foundation">
        <Image src={SineLogo} alt="SINE logo" />
      </a>
    </div>
  );
}
