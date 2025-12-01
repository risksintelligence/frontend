import { ReactNode } from "react";
import Link from "next/link";
import { Shield, MessageSquare, BarChart3, Users } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <div className="border-b border-terminal-border bg-terminal-bg/90 backdrop-blur">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8 text-terminal-accent" />
            <div>
              <h1 className="text-2xl font-bold text-terminal-text">RRIO Admin Dashboard</h1>
              <p className="text-terminal-muted text-sm">Platform Administration & Analytics</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-2">
          <nav className="flex gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface rounded transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/admin/feedback"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface rounded transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              User Feedback
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-terminal-muted hover:text-terminal-text hover:bg-terminal-surface rounded transition-colors"
            >
              <Users className="h-4 w-4" />
              User Analytics
            </Link>
          </nav>
        </div>
      </div>
      
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}