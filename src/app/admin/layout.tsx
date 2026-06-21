"use client";

import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { LayoutGrid, Users, Stethoscope, BarChart3, User } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Providers", href: "/admin/providers", icon: Stethoscope },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Profile", href: "/admin/profile", icon: User },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth("ADMIN");

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <TopBar name={user.name} role="Administrator" />
      <div className="flex">
        <Sidebar navItems={navItems} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}