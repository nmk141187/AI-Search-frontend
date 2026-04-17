import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prospect Search',
  description: 'Company prospect search',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}