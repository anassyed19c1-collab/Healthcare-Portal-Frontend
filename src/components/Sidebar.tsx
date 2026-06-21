"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export default function Sidebar({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-card border-r border-gray-200 min-h-screen pt-6 px-3">
      <nav className="space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-white"
                  : "text-foreground hover:bg-primary/10"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}