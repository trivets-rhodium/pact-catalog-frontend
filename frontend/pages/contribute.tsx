import Link from 'next/link';
import Layout from '../components/layout';
import style from '../styles/Containers.module.css';

export default function Contribute() {
  return (
    <Layout>
      <div className="grid grid-cols-2 gap-x-4 mx-12 h-[75vh]">
        <div className={`${style.solution} pt-16 text-center`}>
          <h2>Solution Provider?</h2>
          <div className="h-3/4 flex flex-col justify-between items-center pt-10 px-10">
            <p>
              To contribute a <strong>PACT Conforming Solution</strong>, open a
              Pull Request in our{' '}
              <a
                href="https://github.com/sine-fdn/pact-catalog"
                target="_blank"
                className="underline"
              >
                GitHub Repository
              </a>{' '}
            </p>
            <p>
              {' '}
              Detailed instructions can be found in the repository's
              documentation.
            </p>
            <a
              href="https://github.com/sine-fdn/pact-catalog/blob/main/CONTRIB_SOLUTION.md"
              target="_blank"
              className="green-primary-button w-fit"
            >
              Go to GitHub
            </a>
          </div>
        </div>
        <div className={`${style.extension} pt-16 text-center`}>
          <h2>Developing Extensions?</h2>
          <div className="h-3/4 flex flex-col justify-between items-center pt-10 px-10">
            <p>
              To contribute an <strong>Industry Specific Extension</strong>,
              either use our submission form (requires a GitHub account)
            </p>
            <Link
              className="light-blue-primary-button"
              href={'/submit-extension'}
            >
              Submission form
            </Link>

            <p>
              or open a Pull Request in our{' '}
              <a
                href="https://github.com/sine-fdn/pact-catalog"
                target="_blank"
                className="underline"
              >
                GitHub Repository
              </a>{' '}
              and open a Pull Request with your solution.
            </p>

            <a
              href="https://github.com/sine-fdn/pact-catalog/blob/main/CONTRIB_EXTENSION.md"
              target="_blank"
              className="light-blue-primary-button"
            >
              Go to GitHub
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
