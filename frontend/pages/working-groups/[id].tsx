import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { TypeOf } from 'zod';
import Container from '../../components/container';
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
  return (
    <Layout>
      <Container workingGroup={props.workingGroup}></Container>
    </Layout>
  );
}
