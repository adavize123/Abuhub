import dynamic from 'next/dynamic';

const TestimonialActionClient = dynamic(() => import('./page.client'), { ssr: false });

export default function Page() {
  return <TestimonialActionClient />;
}
