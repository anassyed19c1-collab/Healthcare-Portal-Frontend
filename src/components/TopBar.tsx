"use client";

import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";

interface TopBarProps {
  name: string;
  role: string;
}

export default function TopBar({ name, role }: TopBarProps) {
  const router = useRouter();

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between bg-card border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
          +
        </div>
        <span className="font-bold text-foreground text-lg">
          Patient Portal
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
            {initials}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-foreground leading-tight">
              {name}
            </p>
            <p className="text-muted leading-tight">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="border border-gray-300 text-foreground text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-gray-50"
        >
          Log out
        </button>
      </div>
    </header>
  );
}