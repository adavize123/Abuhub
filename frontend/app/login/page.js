/**
 * Login Page
 * User authentication page
 */

import dynamic from 'next/dynamic';

const LoginPageClient = dynamic(() => import('./page.client'), { ssr: false });

export default function Page() {
  return <LoginPageClient />;
}
