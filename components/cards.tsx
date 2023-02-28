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

export type CardsRenderer<T> = (cardsContent: T) => JSX.Element[];

type CardsProps<T> = {
  title: string;
  subtitle?: string;
  href?: string;
  message?: string;
  cardsContent: T[];
  render: CardsRenderer<T[]>;
  cardStyle: string;
};

export const cols = 4;

export function Cards<T>(props: CardsProps<T>) {
  const { title, cardsContent, render, subtitle, href, message, cardStyle } =
    props;
  return (
    <section className="pb-10 rounded-sm">
      <h2 className="title px-4">
        {href ? (
          <Link
            href={href ? href : useRouter().pathname}
            className="primary-link"
          >
            {title}
          </Link>
        ) : (
          <>{title}</>
        )}
      </h2>

      <h3 className="px-4">{subtitle}</h3>
      <ul className="grid grid-cols-4 gap-4 mx-4">
        {render(cardsContent)}
        {href && message && (
          <Card
            href={href}
            title={message}
            invert
            cardContent={undefined}
            render={(undefined) => {
              return <></>;
            }}
            cardStyle={cardStyle}
          />
        )}
      </ul>
    </section>
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
      <h1>{title}</h1>
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
        cardStyle={'light-blue-card'}
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

        {endorsers && endorsers.length >= 4
          ? [
              ...endorsers.slice(0, 3).map((endorser: CatalogUser) => {
                return <li>• {endorser.name}</li>;
              }),
              <li className={style['aux-text']}>
                ...and {endorsers.length - 3} more
              </li>,
            ]
          : endorsers.map((endorser: CatalogUser) => {
              <li>• {endorser.name}</li>;
            })}
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
        cardStyle={'green-card'}
      />
    );
  });
}

function renderSolutionCard(
  solution: ConformingSolution | SearchResult
): JSX.Element {
  return solution.extensions ? (
    <div>
      <p className={style['aux-text']}>extensions used</p>
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
    <Link href={href}>
      <li
        className={`flex flex-col justify-between ${style[cardStyle]} leading-tight`}
      >
        <div className="">
          <h3 className="">{title}</h3>
          <p>{subtitle}</p>
        </div>
        {render(cardContent)}
      </li>
    </Link>
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
    <li className={`${style['long-card']} flex flex-col justify-between`}>
      <div>
        <h3>{title}</h3>
        <p className="pr-32 ">{subtitle}</p>
      </div>
      <div className="flex justify-end">
        <Link href={href} className="green-primary-button">
          Learn more
        </Link>{' '}
      </div>
    </li>
  );
}

type UserCard = {
  user: CatalogUser;
  extensions?: CatalogDataModelExtension[];
  solutions?: ConformingSolution[];
  workingGroups?: WorkingGroup[];
};

export function UserCard(props: UserCard) {
  const { user, extensions, solutions, workingGroups } = props;
  const { name, logo, website, kind } = user;
  const router = useRouter();
  return (
    <div className="my-4 break-inside-avoid h-72 min-h-fit min-w-fit flex flex-col">
      <div
        className={`bg-white ${style['user-card-top']} rounded-t-2xl p-4 h-24 shrink-0 overflow-scroll`}
      >
        <a href={website || '#'} target="_blank">
          {logo ? (
            <div className="flex justify-center h-full">
              <img
                src={logo || ''}
                alt={`${name} logo`}
                height="200"
                width="200"
                className="object-scale-down"
              />
            </div>
          ) : (
            <h3 className="mt-2 text-center">{name}</h3>
          )}
        </a>
      </div>
      <div
        className={`${style['user-card-bottom']} rounded-b-2xl p-6 backdrop-blur-sm px-10 grow max-h-48 overflow-scroll`}
      >
        <div>
          {((extensions && extensions.length >= 1) || kind === 'ngo') && (
            <h3>Extensions</h3>
          )}
          <ul>
            {extensions &&
              extensions.map((extension) => {
                return (
                  <li key={`${extension.name}-${extension.version}`}>
                    <Link
                      href={`extensions/${extension.name}/${
                        extension.version
                      }${router.asPath.replace('members', '')}`}
                    >
                      {`${extension.name} v${extension.version}`}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
        {/* TO DO: replace prototype logic specific to solution providers */}
        <div>
          {kind === 'solutionprovider' && <h3>Solutions</h3>}
          {/* {solutions && solutions.length >= 1 && <h3>Solutions</h3>} */}
          <ul>
            {solutions && solutions?.length !== 0
              ? solutions.map((solution) => {
                  return (
                    <li key={solution.id}>
                      <Link
                        href={`solutions/${solution.id}${router.asPath.replace(
                          'members',
                          ''
                        )}`}
                      >
                        {solution.name}
                      </Link>
                    </li>
                  );
                })
              : kind === 'solutionprovider' && (
                  <Link href={'/solutions/steel-industry-solution'}>
                    <li>PACT Conforming Solution</li>
                  </Link>
                )}
          </ul>
        </div>
        <div
          // className={
          //   extensions?.length === 0 || solutions?.length === 0
          //     ? 'mt-10'
          //     : 'mt-4'
          // }
          className="mt-4"
        >
          <h3>Working Groups</h3>
          <ul>
            {workingGroups && workingGroups.length !== 0
              ? workingGroups.map((group) => {
                  return (
                    <li key={group.name}>
                      <Link
                        href={`working-groups/${
                          group.id
                        }${router.asPath.replace('members', '')}`}
                      >
                        {group.name}
                      </Link>
                    </li>
                  );
                })
              : kind === 'solutionprovider' && (
                  <Link href={'/working-groups/sustainable-steel-production'}>
                    <li>Working Group</li>
                  </Link>
                )}
          </ul>
        </div>
        {/* <div className="text-right mt-8">
          <Link href={'#'} className="green-primary-button">
            Learn More
          </Link>
        </div> */}
      </div>
    </div>
  );
}
