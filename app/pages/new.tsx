import { useRouter } from 'next/router';
import { Octokit } from 'octokit';
import { useEffect } from 'react';
import Layout from '../components/layout';
import SubmissionForm from '../components/submission-form';

export default function newSubmission() {
  return (
    <Layout title="New Submission">
      <h2 className="px-40 pb-16">New Data Model Extension</h2>
      <SubmissionForm />
    </Layout>
  );
}
