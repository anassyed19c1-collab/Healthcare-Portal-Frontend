"use client";

import { useState } from "react";

type ApptStatus = "CHECKED_IN" | "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";

interface ProviderAppointment {
  id: number;
  patient: string;
  initials: string;
  reason: string;
  date: string;
  time: string;
  location: string;
  status: ApptStatus;
}

const allAppointments: ProviderAppointment[] = [
  { id: 1, patient: "Eleanor Marsh", initials: "EM", reason: "Follow-up", date: "Thu, Jun 18, 2026", time: "9:00 AM", location: "Suite 204", status: "CHECKED_IN" },
  { id: 2, patient: "Robert Tan", initials: "RT", reason: "Consultation", date: "Thu, Jun 18, 2026", time: "10:30 AM", location: "Suite 204", status: "CONFIRMED" },
  { id: 3, patient: "Grace Park", initials: "GP", reason: "ECG review", date: "Thu, Jun 18, 2026", time: "1:15 PM", location: "Telehealth", status: "CONFIRMED" },
  { id: 4, patient: "David Huang", initials: "DH", reason: "New patient", date: "Mon, Jun 22, 2026", time: "11:15 AM", location: "Suite 204", status: "PENDING" },
  { id: 5, patient: "Sofia Ortega", initials: "SO", reason: "Follow-up", date: "Wed, Jun 24, 2026", time: "3:00 PM", location: "Suite 204", status: "PENDING" },
  { id: 6, patient: "Marcus Lee", initials: "ML", reason: "Blood pressure check", date: "Fri, Jun 26, 2026", time: "9:45 AM", location: "Suite 204", status: "CONFIRMED" },
  { id: 7, patient: "Karen Adams", initials: "KA", reason: "Consultation", date: "Mon, Jun 29, 2026", time: "2:30 PM", location: "Telehealth", status: "CONFIRMED" },
  { id: 8, patient: "James Wood", initials: "JW", reason: "Follow-up", date: "Tue, Jun 9, 2026", time: "10:00 AM", location: "Suite 204", status: "COMPLETED" },
  { id: 9, patient: "Nina Petrova", initials: "NP", reason: "ECG review", date: "Thu, Jun 4, 2026", time: "1:00 PM", location: "Suite 204", status: "COMPLETED" },
  { id: 10, patient: "Omar Haddad", initials: "OH", reason: "Consultation", date: "Mon, Jun 1, 2026", time: "11:30 AM", location: "Telehealth", status: "CANCELLED" },
  { id: 11, patient: "Lucy Chen", initials: "LC", reason: "Follow-up", date: "Wed, May 27, 2026", time: "9:15 AM", location: "Suite 204", status: "COMPLETED" },
  { id: 12, patient: "Paul Rivera", initials: "PR", reason: "New patient", date: "Fri, May 22, 2026", time: "3:45 PM", location: "Suite 204", status: "CANCELLED" },
];

const statusStyles: Record<ApptStatus, string> = {
  CHECKED_IN: "bg-green-100 text-green-700",
  CONFIRMED: "bg-pink-100 text-rose-700",
  PENDING: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-200 text-gray-600",
};

const statusLabels: Record<ApptStatus, string> = {
  CHECKED_IN: "Checked-in",
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const PAGE_SIZE = 6;

export default function ProviderAppointmentsPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allAppointments.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = allAppointments.slice(start, start + PAGE_SIZE);

  const showCheckIn = (status: ApptStatus) => status === "PENDING" || status === "CONFIRMED";
  const showCancel = (status: ApptStatus) =>
    status === "PENDING" || status === "CONFIRMED" || status === "CHECKED_IN";

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
      <p className="text-muted mt-1 mb-6">{allAppointments.length} appointments</p>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm text-muted mb-1">Status</label>
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Checked-in</option>
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
            <div className="flex items-center gap-3 min-w-[200px]">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                {appt.initials}
              </div>
              <div>
                <p className="font-semibold text-foreground">{appt.patient}</p>
                <p className="text-sm text-muted">{appt.reason}</p>
              </div>
            </div>

            <div className="min-w-[160px]">
              <p className="text-sm font-medium text-foreground">{appt.date}</p>
              <p className="text-sm text-muted">
                {appt.time} · {appt.location}
              </p>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyles[appt.status]}`}
              >
                {statusLabels[appt.status]}
              </span>
              <div className="flex items-center gap-3 pl-2">
                {showCheckIn(appt.status) && (
                  <button className="bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-4 py-2 rounded-lg whitespace-nowrap">
                    Check-in
                  </button>
                )}
                {showCancel(appt.status) && (
                  <button className="text-red-600 font-semibold text-sm hover:underline whitespace-nowrap">
                    Cancel
                  </button>
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
          Showing {start + 1}–{Math.min(start + PAGE_SIZE, allAppointments.length)} of {allAppointments.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-foreground disabled:opacity-50 hover:bg-gray-50"
          >
            ‹ Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold ${
                p === page ? "bg-primary text-white" : "border border-gray-300 text-foreground hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-foreground disabled:opacity-50 hover:bg-gray-50"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}