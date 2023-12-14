import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: '%s | StarData Dashboard',
    default: 'StarData Dashboard',
  },
  description: 'Simple Dashboard.',
  metadataBase: new URL('https://dashboard-bomj76hth-rmodesto.vercel.app/'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}