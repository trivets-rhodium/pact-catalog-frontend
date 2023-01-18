import Link from 'next/link';
import style from '../styles/Navbar.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div
      className={`${style.navbar} flex justify-between sticky top-0 items-center z-10`}
    >
      <Link href={'/'}>
        <h2 className="text-white p-0">WBCSD | PACT Online Catalog</h2>
      </Link>
      <div>
        <ul className="flex">
          <li className="px-2">
            <Link href={'#'} className="text-white">
              FAQ
            </Link>
          </li>
          <li className="px-2">
            <Link href={'#'} className="text-white">
              Resources
            </Link>
          </li>
          <li className="px-2">
            <Link href={'#'} className="text-white">
              Contact
            </Link>
          </li>

          {session ? (
            <div>
              <li className="px-2">
                <Link href={'/new'} className="text-white">
                  New Submission
                </Link>
              </li>
              <li className="px-2">
                <button onClick={() => signOut()} className="text-white">
                  Log out
                </button>
              </li>
            </div>
          ) : (
            <li className="px-2">
              <button onClick={() => signIn()} className="text-white">
                Log in
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
