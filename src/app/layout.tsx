import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EscapeRoom Pro - Rezerwuj Przygodę',
  description: 'System rezerwacji dla najlepszych pokojów zagadek.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-100`}
      >
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
