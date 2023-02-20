import Link from 'next/link';

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
  hexagonColor: 'white-hexagon' | 'blue-hexagon' | 'green-hexagon';
  mainText: string;
  className?: string;
  secondaryText?: string;
  small?: boolean;
  href: string;
};

export function Hexagon(props: HexagonProps) {
  const { hexagonColor, mainText, className, secondaryText, small, href } =
    props;

  return (
    <Link href={href}>
      <div
        className={`${hexagonColor} ${
          small ? 'w-28 h-28' : 'w-56 h-56'
        } ${className} flex justify-center items-center`}
      >
        <div className="w-2/3 flex justify-center">
          <div>
            <p className={`${small ? 'text-sm' : 'text-2xl'} text-center`}>
              {mainText}
            </p>
            {secondaryText && <p className="text-xs text-center">{secondaryText}</p>}
          </div>
        </div>
      </div>
    </Link>
  );
}

// function HexagonLayout(props: HexagonLayoutProps) {
//   const { small, classes, children, title, description, textColor, href } =
//     props;
//   return (
//     <div className={classes}>
//       <Link href={href}>
//         <div className={`${textColor} relative`}>
//           <div
//             className={`absolute ${
//               small ? 'text-sm top-6 left-2' : 'text-2xl top-10 left-10 w-32'
//             }`}
//           >
//             <p>{title}</p>
//             <p className="text-xs">{description}</p>
//           </div>
//         </div>
//         <svg
//           width={small ? '100' : '233'}
//           height={small ? '100' : '233'}
//           viewBox="0 0 233 261"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           {children}
//         </svg>
//       </Link>
//     </div>
//   );
// }

// type HexagonProps = {
//   small?: boolean;
//   classes?: string;
//   title?: string;
//   description?: string;
//   href: string;
// };

// export function BlueHexagon(props: HexagonProps) {
//   const { title, description, classes, href, small } = props;
//   return (
//     <HexagonLayout
//       classes={classes}
//       title={title}
//       description={description}
//       textColor="text-white"
//       href={href}
//       small={small}
//     >
//       <path
//         d="M106.075 2.73585C112.249 -0.815276 119.846 -0.815282 126.019 2.73584L222.067 57.9819C228.271 61.5503 232.095 68.1617 232.095 75.3186V185.681C232.095 192.838 228.271 199.45 222.067 203.018L126.019 258.264C119.846 261.815 112.249 261.815 106.075 258.264L10.028 203.018C3.82423 199.45 0 192.838 0 185.681V75.3186C0 68.1617 3.82422 61.5503 10.028 57.9819L106.075 2.73585Z"
//         fill="#0A0552"
//       />
//     </HexagonLayout>
//   );
// }

// export function WhiteHexagon(props: HexagonProps) {
//   const { title, description, classes, href, small } = props;

//   return (
//     <HexagonLayout
//       classes={classes}
//       title={title}
//       description={description}
//       textColor="text-blue"
//       href={href}
//       small={small}
//     >
//       <path
//         d="M106.325 3.16926C112.344 -0.293082 119.751 -0.293087 125.77 3.16926L221.817 58.4153C227.866 61.8945 231.595 68.3406 231.595 75.3186V185.681C231.595 192.659 227.866 199.105 221.817 202.585L125.77 257.831C119.751 261.293 112.344 261.293 106.325 257.831L10.2773 202.585C4.22858 199.105 0.499962 192.659 0.499962 185.681V75.3186C0.499962 68.3406 4.22857 61.8945 10.2773 58.4153L106.325 3.16926Z"
//         fill="white"
//         stroke="#0A0552"
//       />
//     </HexagonLayout>
//   );
// }

// export function GreenHexagon(props: HexagonProps) {
//   const { title, description, classes, href, small } = props;

//   return (
//     <HexagonLayout
//       classes={classes}
//       title={title}
//       description={description}
//       textColor="text-white"
//       href={href}
//       small={small}
//     >
//       <path
//         d="M106.075 2.73585C112.249 -0.815276 119.846 -0.815282 126.019 2.73584L222.067 57.9819C228.271 61.5503 232.095 68.1617 232.095 75.3186V185.681C232.095 192.838 228.271 199.45 222.067 203.018L126.019 258.264C119.846 261.815 112.249 261.815 106.075 258.264L10.028 203.018C3.82419 199.45 -3.8147e-05 192.838 -3.8147e-05 185.681V75.3186C-3.8147e-05 68.1617 3.82418 61.5503 10.028 57.9819L106.075 2.73585Z"
//         fill="#04A17F"
//       />
//     </HexagonLayout>
//   );
// }
