import { SearchResult } from 'minisearch';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  CatalogDataModelExtension,
  ConformingSolution,
  DMEId,
  VersionId,
} from '../lib/catalog-types';

import style from '../styles/Card.module.css';

export type CardsRenderer<T> = (cardDetails: T) => JSX.Element[];

type CardsProps<T> = {
  title: string;
  subtitle?: string;
  href?: string;
  message?: string;
  cardsContent: T[];
  render: CardsRenderer<T[]>;
};

export const cols = 4;

export function Cards<T>(props: CardsProps<T>) {
  const { title, cardsContent, render, subtitle, href, message } = props;
  return (
    <section className="background pb-10 rounded-sm">
      <Link href={href ? href : useRouter().pathname}>
        <h2 className="title px-4">{title}</h2>
      </Link>
      <h3 className="px-4">{subtitle}</h3>
      <ul className="grid grid-cols-4 m-1">
        {render(cardsContent)}
        {href && message && (
          <Link href={href}>
            <li
              className={`${style['card-invert']} flex flex-col justify-between`}
            >
              <div>
                <p className="text-xl font-bold">{message}</p>
              </div>
              <ul></ul>
            </li>
          </Link>
        )}
      </ul>
    </section>
  );
}

export function extensionCards(
  cardDetails: CatalogDataModelExtension[] | SearchResult[]
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
  cardDetails: ConformingSolution[] | SearchResult[]
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
              {extensions.map(
                (extension: {
                  id: DMEId;
                  version: VersionId;
                  author: string;
                }) => {
                  return (
                    <li key={extension.id}>
                      {extension.id} {extension.version}
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        </li>
      </Link>
    );
  });
}
