import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { TypeOf } from 'zod';
import Layout from '../../components/layout';
import { TabsLayout } from '../../components/tabs';
import { GroupId, WorkingGroup } from '../../lib/catalog-types';
import {
  getAllWorkingGroupsIds,
  getWorkingGroup,
} from '../../lib/working-groups';
import style from '../../styles/Containers.module.css';

type Id = {
  id: GroupId;
};
export const getStaticPaths: GetStaticPaths<Id> = async () => {
  const paths = await getAllWorkingGroupsIds();

  return {
    paths,
    fallback: false,
  };
};

type PageProps = {
  workingGroup: WorkingGroup;
};

export const getStaticProps: GetStaticProps<PageProps, Id> = async ({
  params,
}) => {
  if (!params) {
    throw Promise.reject(new Error('No params'));
  }

  const workingGroup = await getWorkingGroup(params.id);
  return {
    props: {
      workingGroup,
    },
  };
};

export default function WorkingGroupDetails(props: PageProps) {
  const {
    workingGroup: { name, members, description, workInProgress, contacts },
  } = props;
  return (
    <Layout>
      <h1 className="mx-1">{name}</h1>
      <div className="flex justify-center mt-6 ">
        <section
          className={`${style['members-background']}  h-100 w-1/3 p-14 rounded-l-md border-2 z-0 align-top`}
        >
          <h2>Members</h2>

          <ul>
            {members.map((member) => {
              return (
                <li className="text-white mb-2" key={member.user_id}>
                  {member.user.name}
                </li>
              );
            })}
          </ul>
        </section>
        <section className="bg-white h-100 p-14 rounded-r-md border-2 z-0 flex-grow">
          <p>{description}</p>
          <h3 className="mt-8 mb-2">Work in Progress</h3>
          <ul>
            {workInProgress.extensions.map((extension) => {
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
                    <p className="my-4 pl-4 text-sm pr-24">
                      {extension.summary}
                    </p>
                  ) : (
                    <p className="my-4 pl-4 text-sm pr-24">
                      {extension.description}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          <ul>
            {workInProgress.solutions.map((solution) => {
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
                </li>
              );
            })}
          </ul>
          <h3 className="mt-8 mb-2">Contacts</h3>
          <ul>
            {Object.keys(contacts).map((contact) => {
              return contact === 'email' ? (
                <li key={contacts[contact]}>
                  <a href={`mailto: ${contacts[contact]}`}>
                    {contacts[contact]}
                  </a>
                </li>
              ) : (
                <li> {contacts[contact as keyof typeof contacts]}</li>
              );
            })}
          </ul>
        </section>
      </div>
    </Layout>
  );
}
