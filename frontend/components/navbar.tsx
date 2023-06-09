import Link from 'next/link';
import Image from 'next/image';
import style from '../styles/Navbar.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';
import pactLogo from '../public/logos/pact-logo-navbar.svg';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div
      className={`${style.navbar} flex justify-between sticky top-0 items-center z-10`}
    >
      <Link
        href={'/'}
        className={`text-xl p-0 ${style['nav-links']} flex items-center justify-start`}
      >
        <Image src={pactLogo} alt={'PACT logo'}></Image>
        <p className="shrink-0" style={{ height: '30px' }}>
          {' '}
          Online Catalog
        </p>
      </Link>
      <div>
        <ul className="flex">
          <li className="px-2">
            <Link
              href={'/solutions'}
              className={`text-white ${style['nav-links']}`}
            >
              Solutions
            </Link>
          </li>
          <li className="px-2">
            <Link
              href={'/extensions'}
              className={`text-white ${style['nav-links']}`}
            >
              Extensions
            </Link>
          </li>
          <li className="px-2">
            <Link
              href={'/collaborators'}
              className={`text-white ${style['nav-links']}`}
            >
              Collaborators
            </Link>
          </li>
          <li className="px-2">
            <Link
              href={'/working-groups'}
              className={`text-white ${style['nav-links']}`}
            >
              Working Groups
            </Link>
          </li>
          <li className="px-2">
            <Link
              href={'/contribute'}
              className={`text-white ${style['nav-links']}`}
            >
              Contribute
            </Link>
          </li>
          <li className="px-2">
            <Link
              href={'/contacts'}
              className={`text-white ${style['nav-links']}`}
            >
              Contacts
            </Link>
          </li>
          <li className="px-2">
            <Link
              href={'/about'}
              className={`text-white ${style['nav-links']}`}
            >
              About
            </Link>
          </li>
          {/* {session ? (
            <li className="px-2">
              <button
                onClick={() => signOut()}
                className={`text-white ${style['nav-links']}`}
              >
                Log out
              </button>
            </li>
          ) : (
            <li className="px-2">
              <button
                onClick={() => signIn()}
                className={`text-white ${style['nav-links']}`}
              >
                Log in
              </button>
            </li>
          )} */}
        </ul>
      </div>
    </div>
  );
}
