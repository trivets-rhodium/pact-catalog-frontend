import { CatalogUser, UserId, WorkingGroup } from '../lib/catalog-types';
import style from '../styles/Containers.module.css';
import Link from 'next/link';

type ContainerProps = {
  workingGroup?: WorkingGroup;
  user?: CatalogUser;
};

function LeftBanner(props: ContainerProps) {
  const { workingGroup, user } = props;

  return (
    <section
      className={`${style['members']}  h-100 w-2/5 p-14 rounded-l-md border-2 z-0 align-top`}
    >
      <div className="sticky top-32">
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
        {user && (
          <>
            {user.logo && (
              <div className="bg-white w-full h-full text-center p-12 rounded-lg">
                <img
                  src={user.logo}
                  alt={`${user.name} logo`}
                  height="200"
                  width="200"
                  className="object-scale-down"
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function RightBox(props: ContainerProps) {
  const { workingGroup, user } = props;
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
                <a href={`mailto: ${workingGroup.email}`}>
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
                    href={`mailto: ${member.user.email}`}
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
      {user && (
        <>
          <div>
            <a href={user.website || '#'} target="_blank">
              {user.website}
            </a>
          </div>
        </>
      )}
    </section>
  );
}

export default function Container(props: ContainerProps) {
  const { workingGroup, user } = props;
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
          <h2 className="mx-1">{user.name}</h2>
          <div className="flex justify-center mt-6 ">
            <LeftBanner user={user} />
            <RightBox user={user} />
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
