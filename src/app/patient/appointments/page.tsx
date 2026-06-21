"use client";

import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";

type DisplayStatus = "UPCOMING" | "COMPLETED" | "CANCELLED";

interface AppointmentRow {
  id: number;
  providerName: string;
  specialization: string;
  initials: string;
  date: string;
  time: string;
  location: string;
  status: DisplayStatus;
}

const allAppointments: AppointmentRow[] = [
  { id: 1, providerName: "Dr. Lena Schmidt", specialization: "Primary Care", initials: "LS", date: "Tue, Jun 30, 2026", time: "9:15 AM", location: "Suite 110", status: "UPCOMING" },
  { id: 2, providerName: "Dr. James Okoro", specialization: "Dermatology", initials: "JO", date: "Thu, Jun 25, 2026", time: "2:00 PM", location: "Telehealth", status: "UPCOMING" },
  { id: 3, providerName: "Dr. Anita Rao", specialization: "Cardiology", initials: "AR", date: "Mon, Jun 22, 2026", time: "10:30 AM", location: "Suite 204", status: "UPCOMING" },
  { id: 4, providerName: "Dr. Lena Schmidt", specialization: "Primary Care", initials: "LS", date: "Thu, May 28, 2026", time: "11:00 AM", location: "Suite 110", status: "COMPLETED" },
  { id: 5, providerName: "Dr. Anita Rao", specialization: "Cardiology", initials: "AR", date: "Tue, May 12, 2026", time: "3:30 PM", location: "Suite 204", status: "COMPLETED" },
  { id: 6, providerName: "Dr. Marcus Bell", specialization: "Orthopedics", initials: "MB", date: "Wed, Apr 30, 2026", time: "1:15 PM", location: "Suite 320", status: "CANCELLED" },
  { id: 7, providerName: "Dr. James Okoro", specialization: "Dermatology", initials: "JO", date: "Thu, Apr 16, 2026", time: "10:00 AM", location: "Telehealth", status: "COMPLETED" },
  { id: 8, providerName: "Dr. Priya Nair", specialization: "Endocrinology", initials: "PN", date: "Mon, Mar 23, 2026", time: "9:45 AM", location: "Suite 215", status: "COMPLETED" },
  { id: 9, providerName: "Dr. Marcus Bell", specialization: "Orthopedics", initials: "MB", date: "Fri, Mar 6, 2026", time: "2:30 PM", location: "Suite 320", status: "CANCELLED" },
];

const PAGE_SIZE = 5;

export default function MyAppointmentsPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allAppointments.length / PAGE_SIZE);

  const start = (page - 1) * PAGE_SIZE;
  const pageItems = allAppointments.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Appointments</h1>
          <p className="text-muted mt-1">{allAppointments.length} appointments</p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg">
          + Book New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 my-6">
        <div>
          <label className="block text-sm text-muted mb-1">Status</label>
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All</option>
            <option>Upcoming</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Date range</label>
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All time</option>
            <option>This month</option>
            <option>Last 3 months</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {pageItems.map((appt) => (
          <div
            key={appt.id}
            className="bg-card rounded-2xl shadow-sm p-5 flex items-center justify-between flex-wrap gap-3"
          >
            <div className="flex items-center gap-3 min-w-[220px]">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                {appt.initials}
              </div>
              <div>
                <p className="font-semibold text-foreground">{appt.providerName}</p>
                <p className="text-sm text-muted">{appt.specialization}</p>
              </div>
            </div>

            <div className="min-w-[160px]">
              <p className="text-sm font-medium text-foreground">{appt.date}</p>
              <p className="text-sm text-muted">
                {appt.time} · {appt.location}
              </p>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <StatusBadge status={appt.status} />
              <div className="flex items-center gap-5 pl-2">
                {appt.status === "UPCOMING" && (
                  <>
                    <button className="text-primary font-semibold text-sm hover:underline whitespace-nowrap">
                      Reschedule
                    </button>
                    <button className="text-red-600 font-semibold text-sm hover:underline whitespace-nowrap">
                      Cancel
                    </button>
                  </>
                )}
                <button className="text-primary font-semibold text-sm hover:underline whitespace-nowrap">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-muted">
          Showing {start + 1}–{Math.min(start + PAGE_SIZE, allAppointments.length)} of{" "}
          {allAppointments.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            ‹ Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold ${
                p === page
                  ? "bg-primary text-white"
                  : "border border-gray-300 text-foreground hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}