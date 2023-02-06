import Link from 'next/link';
import style from '../styles/Navbar.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div
      className={`${style.navbar} flex justify-between sticky top-0 items-center z-10`}
    >
      <Link href={'/'} className={`text-xl font-bold p-0 ${style['nav-links']}`}>
        WBCSD | PACT Online Catalog
      </Link>
      <div>
        <ul className="flex">
          <li className="px-2">
            <Link href={'/faq'} className={`text-white ${style['nav-links']}`}>
              FAQ
            </Link>
          </li>
          <li className="px-2">
            <Link
              href={'/resources'}
              className={`text-white ${style['nav-links']}`}
            >
              Resources
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
              href={'/working-groups'}
              className={`text-white ${style['nav-links']}`}
            >
              Working Groups
            </Link>
          </li>
          <li className="px-2">
            <Link
              href={'/submit-extension'}
              className={`text-white ${style['nav-links']}`}
            >
              Submit Extension
            </Link>
          </li>
          {session ? (
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
          )}
        </ul>
      </div>
    </div>
  );
}
