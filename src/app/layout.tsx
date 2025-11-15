import './globals.css';

export const metadata = {
  title: 'RRIO Dashboard',
  description: 'Front-end for RiskSX Resilience Intelligence Observatory',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
