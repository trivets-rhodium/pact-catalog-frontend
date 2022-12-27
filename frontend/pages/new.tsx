import { useRouter } from 'next/router';
import { Octokit } from 'octokit';
import Layout from '../components/layout';
import SubmissionForm from '../components/submission-form';

export default function newSubmission() {
  return (
    <Layout title="New Submission">
      <SubmissionForm />
    </Layout>
  );
}
