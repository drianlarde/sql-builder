import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter, Work_Sans } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const workSans = Work_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'SQL Query Builder',
    description: `A simple SQL query builder that allows you to create SQL queries without writing any SQL code.`,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn('bg-white', workSans.className)}>
                {children}
            </body>
        </html>
    );
}
