import Link from 'next/link';
import style from '../styles/Navbar.module.css';

export default function Navbar() {
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
          <li className="px-2">
            <Link href={'/new'} className="text-white">
              New Submission
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
