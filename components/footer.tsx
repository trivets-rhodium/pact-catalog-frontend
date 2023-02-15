import { SineLogo } from './logos';

export function Footer() {
  return (
    <div className="w-screen dark-background flex justify-between py-2 px-4 ">
      <p className="text-white">
        PACT Online Catalog — Powered by SINE Foundation
      </p>
      <SineLogo />
    </div>
  );
}
