import Link from 'next/link';
import JSXStyle from 'styled-jsx/style';
import {
  CatalogDataModelExtension,
  ConformingSolution,
} from '../lib/catalog-types';
import { SearchableCatalogDataModelExtension } from '../pages';
import style from '../styles/Home.module.css';

export type CardRenderer<T> = (cardDetails: T) => JSX.Element[];

type CardProps<T> = {
  cardDetails: T[];
  render: CardRenderer<T[]>;
};

export default function Cards<T>(props: CardProps<T>) {
  const { cardDetails, render } = props;

  return <>{render(cardDetails)}</>;
}

export function extensionCards(
  cardDetails:
    | CatalogDataModelExtension[]
    | SearchableCatalogDataModelExtension[]
): JSX.Element[] {
  return cardDetails.map(
    ({ author, name, version, description, catalog_info }) => {
      return (
        <Link
          href={`/extensions/${name}/${version}`}
          key={`${name}/${version}`}
        >
          <li className={`${style.card} flex flex-col justify-between`}>
            <div>
              <p className="text-xl font-bold">{description}</p>
              <p>{version}</p>
            </div>
            <ul>
              <li>Publisher: {author.name}</li>
              <li>Status: {catalog_info.status}</li>
            </ul>
          </li>
        </Link>
      );
    }
  );
}

export function solutionCards(
  cardDetails: ConformingSolution[]
): JSX.Element[] {
  return cardDetails.map(({ id, name, extensions, providerName }) => {
    return (
      <Link href={`/solutions/${id}`} key={id}>
        <li className={`${style.card} flex flex-col justify-between`}>
          <div>
            <p className="text-xl font-bold">{name}</p>
            <p>{providerName}</p>
          </div>
          <div>
            <ul>
              {extensions.slice(0, 2).map(({ id, version }) => {
                return (
                  <li>
                    {id} {version}
                  </li>
                );
              })}
            </ul>
          </div>
        </li>
      </Link>
    );
  });
}
