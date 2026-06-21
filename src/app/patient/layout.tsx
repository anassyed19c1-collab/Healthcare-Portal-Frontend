'use client'

import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
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
  const user = { name: "Eleanor Marsh", role: "Patient" };

  return (
    <div>
      <TopBar name={user.name} role={user.role} />
      <div className="flex">
        <Sidebar navItems={navItems} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}