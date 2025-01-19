'use client';

import dynamic from 'next/dynamic';

const WorkflowEditor = dynamic(
  () => import('../components/WorkflowEditor'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen">
      <WorkflowEditor />
    </main>
  );
}
