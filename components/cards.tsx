import { SearchResult } from 'minisearch';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  CatalogDataModelExtension,
  CatalogUser,
  ConformingSolution,
  DMEId,
  UserId,
  VersionId,
  WorkingGroup,
} from '../lib/catalog-types';
import style from '../styles/Cards.module.css';
import { link } from 'fs';
import { EnrichedUser } from '../pages/collaborators';

export type CardsRenderer<T> = (cardsContent: T) => JSX.Element[];

type CardsProps<T> = {
  title: string;
  subtitle?: string;
  message?: string;
  cardsContent: T[];
  render: CardsRenderer<T[]>;
};

export const cols = 4;

export function Cards<T>(props: CardsProps<T>) {
  const { title, cardsContent, render, subtitle } = props;
  return (
    <section className="pb-6 rounded-sm">
      <h2 className="title px-4">
        <>{title}</>
      </h2>
      <h3 className="px-4">{subtitle}</h3>
      <ul className="grid grid-cols-4 gap-4 mx-4">{render(cardsContent)}</ul>
    </section>
  );
}

export function extensionCards(
  extensions: CatalogDataModelExtension[] | SearchResult[]
): JSX.Element[] {
  const router = useRouter();

  return extensions.map((extension) => {
    const { author, name, version, description, catalog_info, endorsers } =
      extension;
    return (
      <Card
        key={`${name}/${version}`}
        href={`extensions/${name}/${version}${router.asPath.replace(
          'extensions',
          ''
        )}`}
        title={description}
        subtitle={
          catalog_info.status === 'published'
            ? version
            : `${version} (${catalog_info.status})`
        }
        cardContent={extension}
        render={renderExtensionCard}
        cardStyle={'extension-card'}
      />
    );
  });
}

function renderExtensionCard(
  extension: CatalogDataModelExtension | SearchResult
): JSX.Element {
  const { author, catalog_info, endorsers } = extension;

  return (
    <div>
      <div className={style['card-details']}>
        <p>
          <span className={style['aux-text']}>by</span> {author.name}
        </p>
      </div>
      <ul className={`${style['card-details']} leading-tight`}>
        <p className={style['aux-text']}>
          {endorsers && endorsers.length ? `endorsed by` : ''}
        </p>

        {endorsers &&
          (endorsers.length >= 4
            ? [
                ...endorsers.slice(0, 3).map((endorser: CatalogUser) => {
                  return <li key={endorser.name}>• {endorser.name}</li>;
                }),
                <li className={style['aux-text']}>
                  ...and {endorsers.length - 3} more
                </li>,
              ]
            : endorsers.map((endorser: CatalogUser) => {
                <li key={endorser.name}>• {endorser.name}</li>;
              }))}
      </ul>
    </div>
  );
}

export function solutionCards(
  solutions: ConformingSolution[] | SearchResult[]
): JSX.Element[] {
  const router = useRouter();
  return solutions.map((solution) => {
    const { id, name, extensions, providerName } = solution;
    return (
      <Card
        key={id}
        href={`solutions/${id}${router.asPath.replace('solutions', '')}`}
        title={name}
        subtitle={providerName}
        cardContent={solution}
        render={renderSolutionCard}
        cardStyle={'solution-card'}
      />
    );
  });
}

function renderSolutionCard(
  solution: ConformingSolution | SearchResult
): JSX.Element {
  return solution.extensions ? (
    <div>
      <p className={style['aux-text']}>supported extensions</p>
      <ul className={style['card-details']}>
        {solution.extensions.map(
          (extension: { id: DMEId; version: VersionId; author: string }) => {
            return (
              <li key={extension.id}>
                {extension.id} {extension.version}
              </li>
            );
          }
        )}
      </ul>
    </div>
  ) : (
    <></>
  );
}

export function collaboratorCards(
  collaborators: EnrichedUser[]
): JSX.Element[] {
  const router = useRouter();
  return collaborators.map((collaborator) => {
    const { user } = collaborator;
    const { id, website } = user;
    return (
      <Card
        key={id}
        href={website || '#'}
        title={''}
        subtitle={''}
        cardContent={collaborator}
        render={renderCollaboratorCard}
        cardStyle={'collaborator-card'}
      />
    );
  });
}

function renderCollaboratorCard(collaborator: EnrichedUser): JSX.Element {
  const { user, userExtensions, userSolutions, workingGroups } = collaborator;
  const { logo, name } = user;

  return (
    <div className="">
      <div className="flex justify-center h-20 bg-white rounded-lg p-4">
        {logo ? (
          <img
            src={logo || ''}
            alt={`${name} logo`}
            height="200"
            width="200"
            className="object-scale-down"
          />
        ) : (
          <h3>{name}</h3>
        )}
      </div>
      <div className={`p-2 ${style['card-details']}`}>
        <ul className="pb-4">
          {user.kind === 'ngo' ? (
            <>
              <li className={style['aux-text']}>extensions</li>
              {userExtensions &&
                userExtensions.map((extension) => {
                  return (
                    <li key={`${extension.name}/${extension.version}`}>
                      {extension.name} {extension.version}
                    </li>
                  );
                })}
            </>
          ) : (
            <>
              <li className={style['aux-text']}>solutions</li>
              {userSolutions &&
                userSolutions.slice(0, 2).map((solution) => {
                  return <li key={solution.id}>{solution.name}</li>;
                })}
            </>
          )}
        </ul>
        <ul>
          <li className={style['aux-text']}>working groups</li>
          {workingGroups &&
            workingGroups.map((workingGroup) => {
              return <li key={workingGroup.name}>{workingGroup.name}</li>;
            })}
        </ul>
      </div>
    </div>
  );
}

type CardProps<T> = {
  href: string;
  title: string;
  invert?: boolean;
  subtitle?: string;
  cardContent: T;
  render: CardRenderer<T>;
  cardStyle: string;
};

type CardRenderer<T> = (cardDetails: T) => JSX.Element;

function Card<T>(props: CardProps<T>) {
  const { href, title, invert, subtitle, cardContent, render, cardStyle } =
    props;

  return (
    <Link
      href={href}
      target={cardStyle === 'collaborator-card' ? '_blank' : ''}
    >
      <li
        key={href}
        className={`flex flex-col justify-between ${style[cardStyle]} leading-tight`}
      >
        {cardStyle !== 'collaborator-card' ? (
          <>
            <div>
              <h3 className="">{title}</h3>
              <p>{subtitle}</p>
            </div>
            {render(cardContent)}
          </>
        ) : (
          <>{render(cardContent)}</>
        )}
      </li>
    </Link>
  );
}

type LongCardsProps = {
  title: string;
  longCards: {
    href: string;
    title: string;
    subtitle: string;
    id: string;
  }[];
};

export function LongCards(props: LongCardsProps) {
  const { title, longCards } = props;

  return (
    <section className="pb-10 rounded-sm">
      <h2>{title}</h2>
      <ul>
        {longCards.map((longCard) => {
          return (
            <LongCard
              href={longCard.href}
              title={longCard.title}
              subtitle={longCard.subtitle}
              key={longCard.id}
            />
          );
        })}
      </ul>
    </section>
  );
}

type LongCardProps = {
  href: string;
  title: string;
  subtitle: string;
};

function LongCard(props: LongCardProps) {
  const { href, title, subtitle } = props;

  return (
    <li
      className={`${style['long-card']} flex flex-col justify-between drop-shadow`}
      key={title}
    >
      <div>
        <h3>{title}</h3>
        <p className="pr-32 ">{subtitle}</p>
      </div>
      <div className="flex justify-end">
        <Link href={href} className="blue-primary-button">
          Learn more
        </Link>{' '}
      </div>
    </li>
  );
}
