/**
 * Global Styles
 * Tailwind CSS imports and global styling
 */

import '../styles/globals.css';
import { Poppins, Inter } from 'next/font/google';
import Layout from '../components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Abuhub — Build Smarter. Grow Together.',
  description:
    'Abuhub is a technology, data and innovation hub helping ambitious businesses ship modern web & mobile products, unlock AI, and scale with confidence.',
  keywords: [
    'web development',
    'app development',
    'AI training',
    'digital solutions',
    'business support',
    'data analytics',
    'UI/UX design',
  ],
  authors: [{ name: 'Abuhub Team' }],
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'Abuhub — Build Smarter. Grow Together.',
    description: 'Tech · Data · Innovation · Support — your partner for building digital solutions.',
    url: 'https://abuhub.com',
    siteName: 'Abuhub',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 1200,
      },
    ],
    type: 'website',
  },
};

/**
 * Root Layout Component
 * Wraps the entire application
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="bg-ink-950 text-cream-100 font-inter">
        <Layout>{children}</Layout>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  );
}
