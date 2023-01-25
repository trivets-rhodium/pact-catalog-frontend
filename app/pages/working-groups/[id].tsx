import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../components/layout';
import { TabsLayout } from '../../components/tabs';
import { GroupId, WorkingGroup } from '../../lib/catalog-types';
import {
  getAllWorkingGroupsIds,
  getWorkingGroup,
} from '../../lib/working-groups';
import style from '../../styles/Banner.module.css';

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
  const { workingGroup } = props;
  return (
    <Layout>
      <h1 className="mx-1">{workingGroup.name}</h1>
      <div className="flex justify-center mt-6 mx-12">
        <section
          className={`${style['members-background']}  h-100 w-1/3 p-14 rounded-l-md border-2 z-0 align-top`}
        >
          <h2>Members</h2>

          <ul>
            {workingGroup.members.map((member) => {
              return (
                <li className="text-white mb-2" key={member.user_id}>
                  {member.user.name}
                </li>
              );
            })}
          </ul>
        </section>
        <section className="h-100 p-14 rounded-r-md border-2 z-0 flex-grow">
          <p>{workingGroup.description}</p>
          <h3 className="mt-8 mb-2">Work in Progress</h3>
          <ul>
            {workingGroup.workInProgress.extensions.map((extension) => {
              return (
                <li key={`${extension.id}.${extension.version}`}>
                  {extension.description} (Extension)
                </li>
              );
            })}
          </ul>
          <ul>
            {workingGroup.workInProgress.solutions.map((solution) => {
              return <li key={solution.id}>{solution.name} (Solution)</li>;
            })}
          </ul>
          <h3 className="mt-8 mb-2">Contacts</h3>
          <p>{Object.values(workingGroup.contacts)}</p>
        </section>
      </div>
    </Layout>
  );
}
