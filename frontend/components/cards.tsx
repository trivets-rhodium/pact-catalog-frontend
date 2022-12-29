import Link from 'next/link';
import {
  CatalogDataModelExtension,
  ConformingSolution,
} from '../lib/catalog-types';
import style from '../styles/Home.module.css';

export type CardsRenderer<T> = (cardDetails: T) => JSX.Element[];

type CardsProps<T> = {
  title: string;
  cardsContent: T[];
  render: CardsRenderer<T[]>;
};

export function Cards<T>(props: CardsProps<T>) {
  const { title, cardsContent, render } = props;
  return (
    <section className="background pb-10 rounded-sm">
      <h2 className="title px-4">{title}</h2>
      <ul className="grid grid-cols-3">{render(cardsContent)}</ul>
    </section>
  );
}

export function extensionCards(
  cardDetails: CatalogDataModelExtension[]
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
                  <li key={id}>
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
