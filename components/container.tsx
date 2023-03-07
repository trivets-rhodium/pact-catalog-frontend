import {
  CatalogUser,
  Collaborator,
  UserId,
  WorkingGroup,
} from '../lib/catalog-types';
import style from '../styles/Containers.module.css';
import Link from 'next/link';
import { link } from 'fs';

type ContainerProps = {
  workingGroup?: WorkingGroup;
  collaborator?: Collaborator;
};

function LeftBanner(props: ContainerProps) {
  const { workingGroup, collaborator } = props;

  return (
    <section
      className={`${
        workingGroup ? `${style['members']} p-14` : `${style['user']} p-0`
      }  h-100 w-2/5 z-0 align-top`}
    >
      <div className={workingGroup ? 'sticky top-32' : ''}>
        {workingGroup && (
          <>
            <h2>Members</h2>

            <ul className="">
              {workingGroup.members.map((member) => {
                return (
                  <li
                    className="text-white my-8 border-l-2 pl-2"
                    key={member.user_id}
                  >
                    {member.user.name}
                  </li>
                );
              })}
            </ul>
          </>
        )}
        {collaborator?.user && (
          <>
            {collaborator.user.logo && (
              <>
                <div className={style['user-logo']}>
                  <img
                    src={collaborator.user.logo}
                    alt={`${collaborator.user.name} logo`}
                    height="200"
                    width="200"
                    className="object-scale-down"
                  />
                </div>
                <div className={style['user-info']}>
                  <h3>{collaborator.user.name}</h3>

                  <h3 className="pt-8">Website</h3>
                  <a href={collaborator.user.website || '#'} target="_blank">
                    {collaborator.user.website}
                  </a>

                  <h3 className="pt-8">Contacts</h3>
                  <a href={`mailto:${collaborator.user.email || '#'}`}>
                    {collaborator.user.email}
                  </a>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function RightBox(props: ContainerProps) {
  const { workingGroup, collaborator } = props;
  return (
    <section
      className={`bg-white h-100 p-14 z-0 flex-grow ${style['working-group-details']} drop-shadow`}
    >
      {workingGroup && (
        <>
          <p>{workingGroup.description}</p>
          <h3 className="mt-8 mb-2">Work in Progress</h3>
          <ul>
            {workingGroup.workInProgress.extensions?.map((extension) => {
              return (
                <li
                  key={`${extension.id}.${extension.version}`}
                  className="mb-2"
                >
                  <Link
                    href={`/extensions/${extension.id}/${extension.version}`}
                  >
                    {extension.id} {extension.version}
                  </Link>{' '}
                  <span className={style.pill}>Extension</span>
                  {extension.summary ? (
                    <div>
                      <p className="my-4 pl-4 text-sm pr-24">
                        {extension.summary}
                      </p>
                    </div>
                  ) : (
                    <p className="my-4 pl-4 text-sm pr-24">
                      {extension.description}
                    </p>
                  )}
                  <p className="my-4 pl-4 text-sm pr-24">
                    <span className="b bol">Publisher:</span> {extension.author}
                  </p>
                </li>
              );
            })}
          </ul>
          <ul>
            {workingGroup.workInProgress.solutions?.map((solution) => {
              return (
                <li key={solution.id}>
                  <Link href={`/solutions/${solution.id}`}>
                    {solution.name}
                  </Link>{' '}
                  <span className={style.pill}>Solution</span>
                  {solution.summary && (
                    <p className="my-4 pl-4 text-sm pr-24">
                      {solution.summary}
                    </p>
                  )}
                  <p className="my-4 pl-4 text-sm pr-24">
                    <span className="b bol">Provider:</span>{' '}
                    {solution.providerName}
                  </p>
                </li>
              );
            })}
          </ul>
          <h3 className="mt-8 mb-2">Completed Work</h3>
          <ul>
            {workingGroup.completedWork.extensions?.map((extension) => {
              return (
                <li
                  key={`${extension.id}.${extension.version}`}
                  className="mb-2"
                >
                  <Link
                    href={`/extensions/${extension.id}/${extension.version}`}
                  >
                    {extension.id} {extension.version}
                  </Link>{' '}
                  <span className={style.pill}>Extension</span>
                  <p className="my-4 pl-4 text-sm pr-24">
                    <span className="b bol">Publisher:</span> {extension.author}
                  </p>
                </li>
              );
            })}
          </ul>
          <ul>
            {workingGroup.completedWork.solutions?.map((solution) => {
              return (
                <li key={solution.id}>
                  <Link href={`/solutions/${solution.id}`}>
                    {solution.name}
                  </Link>{' '}
                  <span className={style.pill}>Solution</span>
                  {solution.summary && (
                    <p className="my-4 pl-4 text-sm pr-24">
                      {solution.summary}
                    </p>
                  )}
                  <p className="my-4 pl-4 text-sm pr-24">
                    <span className="b bol">Provider:</span>{' '}
                    {solution.providerName}
                  </p>
                </li>
              );
            })}
          </ul>
          <h3 className="mt-8 mb-2">Contacts</h3>
          <ul>
            {workingGroup.email && (
              <li
                className=" pr-4 grid grid-cols-2 my-4"
                key={workingGroup.email}
              >
                <p>Group email:</p>
                <a href={`mailto:${workingGroup.email}`}>
                  {workingGroup.email}
                </a>
              </li>
            )}
            {workingGroup.members.map((member) => {
              return (
                <li
                  className="font-light pr-4 grid grid-cols-2 my-4"
                  key={member.user_id}
                >
                  <p className="pr-10">{member.user.name}: </p>
                  <a
                    href={`mailto:${member.user.email}`}
                    className="flex items-end"
                  >
                    {member.user.email}
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      )}
      {collaborator && (
        <>
          <div>
            <h3 className="pb-8">Our vision</h3>
            {collaborator.extensions.length !== 0 && (
              <div className="pb-8">
                <h3 className="pb-2">Contributions</h3>
                <ul>
                  {collaborator.extensions.map((extension) => {
                    return (
                      <li
                        key={`${extension.name}/${extension.version}`}
                        className="pb-2"
                      >
                        <Link
                          href={`/extensions/${extension.name}/${extension.version}`}
                          className="underline"
                        >
                          {extension.name} v.{extension.version}
                        </Link>{' '}
                        <span className={style.pill}>Extension</span>
                        <p className="pr-24">
                          {extension.catalog_info.summary}
                        </p>
                      </li>
                    );
                  })}
                  {collaborator.solutions.length !== 0 && (
                    <ul>
                      {collaborator.solutions.map((solution) => {
                        return (
                          <li key={solution.id} className="pb-2">
                            <Link
                              href={`/solutions/${solution.id}`}
                              className="underline"
                            >
                              {solution.name}
                            </Link>{' '}
                            <span className={style.pill}>Solution</span>
                            <p className="pr-24">{solution.summary}</p>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </ul>
              </div>
            )}

            {collaborator.workingGroups.length !== 0 && (
              <div className="pb-8">
                <h3 className="pb-2">Working Groups</h3>
                <ul>
                  {collaborator.workingGroups.map((workingGroup) => {
                    return (
                      <li key={workingGroup.id} className="pb-2">
                        <Link
                          href={`/working-groups/${workingGroup.id}`}
                          className="underline"
                        >
                          {workingGroup.name}
                        </Link>
                        <p className="pr-24">{workingGroup.description}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default function Container(props: ContainerProps) {
  const { workingGroup, collaborator: user } = props;
  console.log('user', user);
  return (
    <>
      {workingGroup && (
        <>
          <h2 className="mx-1">{workingGroup.name}</h2>
          <div className="flex justify-center mt-6 ">
            <LeftBanner workingGroup={workingGroup} />
            <RightBox workingGroup={workingGroup} />
          </div>
        </>
      )}
      {user && (
        <>
          <div className="flex justify-center mt-6 ">
            <LeftBanner collaborator={user} />
            <RightBox collaborator={user} />
          </div>
        </>
      )}
      <div className="text-right pt-12">
        {workingGroup && (
          <Link
            href="/working-groups"
            className="blue-secondary-button text-right"
          >
            Back to groups
          </Link>
        )}
        {user && (
          <Link
            href="/collaborators"
            className="blue-secondary-button text-right"
          >
            Back to collaborators
          </Link>
        )}
      </div>
    </>
  );
}
