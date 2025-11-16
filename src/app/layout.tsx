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
      <body>
        <nav className="flex items-center justify-between bg-[#0f172a] px-6 py-3 font-mono text-white">
          <div>
            <span className="text-lg font-bold">RRIO Dashboard</span>
            <p className="text-xs text-[#94a3b8]">Ethical AI risk intelligence for U.S. finance & supply chain</p>
          </div>
          <div className="text-xs space-x-4">
            <a href="/" className="hover:underline">Dashboard</a>
            <a href="/transparency" className="hover:underline">Transparency</a>
            <a href="/community" className="hover:underline">Community</a>
            <a href="/community/admin" className="hover:underline">Reviewer</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
