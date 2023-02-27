import Link from 'next/link';
import { Footer } from '../components/footer';
import { Hexagon } from '../components/hexagons';
import Layout from '../components/layout';

export default function About() {
  return (
    <Layout>
      <section className=" min-h-screen">
        <h1 className="">About the PACT Online Catalog</h1>
        <div className="grid grid-cols-3 gap-12 my-12 h-80">
          <p className="col-span-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            odio nunc, placerat ut pellentesque ut, pharetra non risus. Interdum
            et malesuada fames ac ante ipsum primis in faucibus. Suspendisse
            vitae justo vel felis bibendum malesuada non vel est. Morbi
            ullamcorper vel sapien et commodo. Vestibulum massa est, rhoncus
            vitae quam quis, scelerisque consectetur velit. Sed urna justo,
            condimentum vel leo feugiat, efficitur scelerisque risus.
          </p>
          <iframe
            className="col-span-2"
            width={'100%'}
            height={'100%'}
            src="https://www.youtube.com/embed/9e45s7-CeaY"
            title="This new PACT is helping companies fight Scope 3 emissions"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        <div className="flex justify-center mt-24 ">
          <Hexagon
            svgPath="/hexagons/hex-1-small.svg"
            className="mx-2"
            mainText="Industry Specific Extensions"
            small
            href="/extensions"
          />
          <Hexagon
            svgPath="/hexagons/hex-2-small.svg"
            className="mx-2"
            mainText="PACT Compliant Solutions"
            small
            href="/solutions"
          />
          <Hexagon
            svgPath="/hexagons/hex-3-small.svg"
            className="mx-2"
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
              svgPath="/hexagons/hex-1.svg"
              className="shrink-0 text-blue"
              mainText="Industry Specific Extensions"
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
              svgPath="/hexagons/hex-2.svg"
              className="shrink-0"
              mainText="PACT Compliant Solutions"
              href="/solutions"
            />
          </div>
          <div className="flex items-center mb-32">
            <Hexagon
              svgPath="/hexagons/hex-3.svg"
              className="shrink-0"
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
    </Layout>
  );
}
