import type { Metadata } from 'next';
import { Knewave, Urbanist } from 'next/font/google';
import './globals.css';

const knewave = Knewave({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-knewave',
  display: 'swap',
});

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-urbanist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Compass — AI Opportunity Scan for Malaysian Businesses',
  description:
    'Find out where AI can help your business. Complete a short diagnostic and receive a customised AI Opportunity Scan report from Hustle Malaysia.',
  keywords: ['AI readiness', 'Malaysia', 'AI training', 'team AI adoption', 'Hustle Malaysia', 'AI opportunity scan'],
  icons: {
    icon: 'https://cdn.prod.website-files.com/69a817c94060f9d4bfb1c760/6a045a6e3af082c160063e5d_H.%20Logo%20(2026).webp',
    shortcut: 'https://cdn.prod.website-files.com/69a817c94060f9d4bfb1c760/6a045a6e3af082c160063e5d_H.%20Logo%20(2026).webp',
    apple: 'https://cdn.prod.website-files.com/69a817c94060f9d4bfb1c760/6a045a6e3af082c160063e5d_H.%20Logo%20(2026).webp',
  },
  openGraph: {
    title: 'AI Compass — AI Opportunity Scan',
    description: 'Find out where AI can help your business. Free customised report for Malaysian teams.',
    siteName: 'Hustle Malaysia',
    locale: 'en_MY',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${knewave.variable} ${urbanist.variable}`}>
      <body className="font-urbanist">{children}</body>
    </html>
  );
}
