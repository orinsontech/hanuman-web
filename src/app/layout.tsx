import type { Metadata } from 'next';
import { Poppins, Noto_Sans_Devanagari } from 'next/font/google';
import FbclidCapture from '@/components/FbclidCapture';
import MetaPixel from '@/components/MetaPixel';
import GoogleTag from '@/components/GoogleTag';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '700'],
  variable: '--font-devanagari',
});

export const metadata: Metadata = {
  title: 'Hanuman Stuti - 40 Din Ki Sadhana',
  description: 'Rozmana Hanuman Ji ki stuti sunein aur 40 din puri karke certificate prapt karein. Apni manokamnayein puri karein.',
  keywords: 'hanuman stuti, hanuman chalisa, 40 day challenge, manokamna, spiritual',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className={`${poppins.variable} ${devanagari.variable}`}>
      <body className="min-h-screen bg-amber-50 font-sans antialiased">
        <MetaPixel />
        <GoogleTag />
        <FbclidCapture />
        {children}
      </body>
    </html>
  );
}
