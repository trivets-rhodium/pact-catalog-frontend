import { GetStaticPaths, GetStaticProps } from 'next';
import { GroupId, WorkingGroup } from '../../lib/catalog-types';
import {
  getAllWorkingGroupsIds,
  getWorkingGroup,
} from '../../lib/working-groups';

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

export default function WorkingGroup(props: PageProps) {
    return (
        <h1>One Working Group</h1>
    )
}
