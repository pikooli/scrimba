import type { Metadata } from 'next';
import { Big_Shoulders_Display, Poppins } from 'next/font/google';
import './globals.css';

const bigShouldersDisplay = Big_Shoulders_Display({
  variable: '--font-big-shoulders-display',
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
});
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bigShouldersDisplay.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
