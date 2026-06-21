"use client";

import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { LayoutGrid, CalendarCheck, Plus, User } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/patient/dashboard", icon: LayoutGrid },
  { label: "My Appointments", href: "/patient/appointments", icon: CalendarCheck },
  { label: "Book Appointment", href: "/patient/book-appointment", icon: Plus },
  { label: "Profile", href: "/patient/profile", icon: User },
];

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth("PATIENT");

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <TopBar name={user.name} role="Patient" />
      <div className="flex">
        <Sidebar navItems={navItems} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}