"use client";

import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { LayoutGrid, CalendarClock, ClipboardList, Users, User } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutGrid },
  { label: "My Schedule", href: "/provider/schedule", icon: CalendarClock },
  { label: "Appointments", href: "/provider/appointments", icon: ClipboardList },
  { label: "Patients", href: "/provider/patients", icon: Users },
  { label: "Profile", href: "/provider/profile", icon: User },
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth("PROVIDER");

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <TopBar name={user.name} role={user.specialization || "Provider"} />
      <div className="flex">
        <Sidebar navItems={navItems} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}