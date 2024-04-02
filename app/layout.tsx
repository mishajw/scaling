import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './header';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Scaling',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Header>
          <Suspense>{children}</Suspense>
        </Header>
      </body>
    </html>
  );
}
