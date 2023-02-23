import Link from 'next/link';
import Image from 'next/image';

type HexagonLayoutProps = {
  small?: boolean;
  classes?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  textColor: string;
  href: string;
};

type HexagonProps = {
  svgPath: string;
  mainText: string;
  className?: string;
  secondaryText?: string;
  small?: boolean;
  href: string;
};

export function Hexagon(props: HexagonProps) {
  const { mainText, className, secondaryText, small, href, svgPath } = props;

  return (
    <Link
      href={href}
      className={`${className} flex justify-center items-center w-fit`}
    >
      <div
        className={`relative flex items-center justify-center hover:opacity-60`}
      >
        <img src={svgPath} alt={`${mainText} hover:opacity-60`} />
        <div className="absolute p-6 w-full ">
          <div className="flex justify-center hexagon-text-shadow">
            <div>
              <h3
                className={`text-white ${
                  small ? 'text-sm px-12' : 'text-2xl leading-6 mb-2 '
                } text-center`}
              >
                {mainText}
              </h3>
              {secondaryText && (
                <p className="text-xs text-center text-white">{secondaryText}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
