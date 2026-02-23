import './globals.css';

export const metadata = {
  title: 'FitMySpace',
  description: 'Storage product recommendations based on available space'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
