"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, FileText, Target, BookOpen, HelpCircle, TrendingUp } from "lucide-react";

interface AboutPageButton {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const ABOUT_PAGES: AboutPageButton[] = [
  {
    label: "About",
    href: "/about",
    icon: <Info className="w-3 h-3" />
  },
  {
    label: "Methodology", 
    href: "/methodology",
    icon: <FileText className="w-3 h-3" />
  },
  {
    label: "Use Cases",
    href: "/use-cases",
    icon: <Target className="w-3 h-3" />
  },
  {
    label: "Getting Started",
    href: "/getting-started",
    icon: <HelpCircle className="w-3 h-3" />
  },
  {
    label: "Docs",
    href: "/documentation",
    icon: <BookOpen className="w-3 h-3" />
  },
  {
    label: "Intelligence",
    href: "/insights",
    icon: <TrendingUp className="w-3 h-3" />
  }
];

export default function AboutRRIOButtons() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 min-w-max">
      {ABOUT_PAGES.map((page) => {
        const isActive = pathname === page.href;
        return (
          <Link
            key={page.href}
            href={page.href}
            className={`flex items-center gap-1 rounded border px-2 py-1 text-xs font-mono transition-colors whitespace-nowrap ${
              isActive
                ? "border-terminal-accent bg-terminal-accent/20 text-terminal-accent"
                : "border-terminal-border text-terminal-text hover:bg-terminal-surface hover:border-terminal-accent/50"
            }`}
          >
            {page.icon}
            <span className="hidden sm:inline">{page.label}</span>
          </Link>
        );
      })}
    </div>
  );
}