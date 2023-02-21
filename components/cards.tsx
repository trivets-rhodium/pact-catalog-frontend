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

export type CardsRenderer<T> = (cardsContent: T) => JSX.Element[];

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
      <ul className="grid grid-cols-4 m-1">
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
    <section className="background pb-10 rounded-sm">
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
        subtitle={version}
        cardContent={extension}
        render={renderExtensionCard}
      />
    );
  });
}

function renderExtensionCard(
  extension: CatalogDataModelExtension | SearchResult
): JSX.Element {
  const { author, catalog_info, endorsers } = extension;

  return (
    <ul>
      <li>Publisher: {author.name}</li>
      <li>Status: {catalog_info.status}</li>
      <li>
        {endorsers && endorsers.length
          ? `Endorsers (${endorsers.length}):`
          : ''}
        <ul>
          {endorsers &&
            endorsers.map((endorser: CatalogUser) => {
              return <li key={endorser.id}>{endorser.name}</li>;
            })}
        </ul>
      </li>
    </ul>
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
      />
    );
  });
}

function renderSolutionCard(
  solution: ConformingSolution | SearchResult
): JSX.Element {
  return (
    <ul>
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
  );
}

type CardProps<T> = {
  href: string;
  title: string;
  invert?: boolean;
  subtitle?: string;
  cardContent: T;
  render: CardRenderer<T>;
};

export type CardRenderer<T> = (cardDetails: T) => JSX.Element;

function Card<T>(props: CardProps<T>) {
  const { href, title, invert, subtitle, cardContent, render } = props;

  return (
    <Link href={href}>
      <li
        className={`${
          invert ? style['card-invert'] : style.card
        } flex flex-col justify-between`}
      >
        <div className="pb-10">
          <p className="font-bold">{title}</p>
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
        <Link href={href} className="primary-button">
          Learn more
        </Link>{' '}
      </div>
    </li>
  );
}

type UserCard = {
  name: string;
  logo?: string;
  extensions?: CatalogDataModelExtension[];
  solutions?: ConformingSolution[];
  workingGroups?: WorkingGroup[];
};

export function UserCard(props: UserCard) {
  const { name, logo, extensions, solutions, workingGroups } = props;
  const router = useRouter();
  return (
    <div className="my-4">
      <div className={`bg-white ${style['user-card-top']} rounded-t-2xl p-8`}>
        <Image
          src={
            'https://rmi.org/wp-content/uploads/2021/08/rmi_logo_horitzontal_no_tagline.svg'
          }
          alt={'RMI logo'}
          width={0}
          height={0}
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>
      <div className={`${style['user-card-bottom']} rounded-b-2xl p-6`}>
        <h2>{name}</h2>
        <div className="mb-4">
          {extensions && extensions.length >= 1 && <h3>Extensions</h3>}
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
        <div className="mb-4">
          {solutions && solutions.length >= 1 && <h3>Solutions</h3>}
          <ul>
            {solutions &&
              solutions.map((solution) => {
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
              })}
          </ul>
        </div>
        <div className="mb-4">
          {workingGroups && workingGroups.length >= 1 && (
            <h3>Working Groups</h3>
          )}
          <ul>
            {workingGroups &&
              workingGroups.map((group) => {
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
              })}
          </ul>
        </div>
        <div className="text-right mt-8">
          <Link href={'#'} className="primary-button">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
