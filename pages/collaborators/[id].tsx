import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { TypeOf } from 'zod';
import Container from '../../components/container';
import Layout from '../../components/layout';
import { TabsLayout } from '../../components/tabs';
import {
  CatalogUser,
  GroupId,
  UserId,
  WorkingGroup,
} from '../../lib/catalog-types';
import { getAllUsersIds, getUser } from '../../lib/users';
import {
  getAllWorkingGroupsIds,
  getWorkingGroup,
} from '../../lib/working-groups';
import style from '../../styles/Containers.module.css';

type Id = {
  id: UserId;
};
export const getStaticPaths: GetStaticPaths<Id> = async () => {
  const paths = await getAllUsersIds();

  return {
    paths,
    fallback: false,
  };
};

type PageProps = {
  user: CatalogUser;
};

export const getStaticProps: GetStaticProps<PageProps, Id> = async ({
  params,
}) => {
  if (!params) {
    throw Promise.reject(new Error('No params'));
  }

  const user = await getUser(params.id);
  return {
    props: {
      user,
    },
  };
};

export default function WorkingGroupDetails(props: PageProps) {
  return (
    <Layout>
      <Container user={props.user}></Container>
    </Layout>
  );
}
