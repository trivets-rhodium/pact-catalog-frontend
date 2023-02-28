import SineLogo from '../public/logos/sine-logo.png';
import Image from 'next/image';

export function Footer() {
  return (
    <div className="w-screen flex justify-center items-center py-2 px-4 opacity-50">
      <p className="mr-2 text-sm align-middle">powered by </p>
      <a href="https://sine.foundation">
        <Image src={SineLogo} width={200} height={150} alt="SINE logo" />
      </a>
    </div>
  );
}
