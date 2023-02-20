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
    <div className={`${className} flex justify-center items-center w-fit`}>
      <Link
        href={href}
        className={`relative flex items-center justify-center ${
          small ? 'small-hexagon-clip mx-4' : 'hexagon-clip'
        } `}
      >
        <img src={svgPath} alt={`${mainText} hexagon`} />
        <div className="absolute p-6 w-full pb-8">
          <div className="flex justify-center">
            <div>
              <p
                className={`${
                  small ? 'text-sm px-12' : 'text-2xl'
                } text-center`}
              >
                {mainText}
              </p>
              {secondaryText && (
                <p className="text-xs text-center">{secondaryText}</p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
