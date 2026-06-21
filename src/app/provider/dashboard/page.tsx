"use client";

import { useState } from "react";
import AvailabilityGrid from "@/components/AvailabilityGrid";

type TodayStatus = "CHECKED_IN" | "CONFIRMED";

const todayAppointments = [
  { id: 1, patient: "Eleanor Marsh", initials: "EM", reason: "Follow-up", status: "CHECKED_IN" as TodayStatus, time: "9:00 AM", location: "Suite 204" },
  { id: 2, patient: "Robert Tan", initials: "RT", reason: "Consultation", status: "CONFIRMED" as TodayStatus, time: "10:30 AM", location: "Suite 204" },
  { id: 3, patient: "Grace Park", initials: "GP", reason: "ECG review", status: "CONFIRMED" as TodayStatus, time: "1:15 PM", location: "Telehealth" },
];

const initialRequests = [
  { id: 1, patient: "David Huang", initials: "DH", requested: "Requested Mon, Jun 22 · 11:15 AM" },
  { id: 2, patient: "Sofia Ortega", initials: "SO", requested: "Requested Wed, Jun 24 · 3:00 PM" },
];

export default function ProviderDashboard() {
  const [requests, setRequests] = useState(initialRequests);

  const handleApprove = (id: number) => {
    // backend se wire karte waqt: PUT /api/provider/appointments/:id/approve
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDecline = (id: number) => {
    // backend se wire karte waqt: PUT /api/provider/appointments/:id/decline
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Good morning, Dr. Rao</h1>
      <p className="text-muted mt-1 mb-8">
        You have {todayAppointments.length} appointments today and {requests.length} requests awaiting review.
      </p>

      {/* Today's Appointments */}
      <h2 className="text-lg font-bold text-foreground mb-4">Today&apos;s Appointments</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {todayAppointments.map((appt) => (
          <div key={appt.id} className="bg-card rounded-2xl shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                  {appt.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{appt.patient}</p>
                  <p className="text-sm text-muted">{appt.reason}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  appt.status === "CHECKED_IN"
                    ? "bg-green-100 text-green-700"
                    : "bg-pink-100 text-rose-700"
                }`}
              >
                {appt.status === "CHECKED_IN" ? "Checked-in" : "Confirmed"}
              </span>
            </div>
            <div className="bg-background rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="font-medium text-foreground text-sm">{appt.time}</span>
              <span className="text-sm text-muted">{appt.location}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Requests */}
      <h2 className="text-lg font-bold text-foreground mb-4">Pending Requests</h2>
      <div className="bg-card rounded-2xl shadow-sm divide-y divide-gray-100 mb-10">
        {requests.length === 0 && (
          <p className="text-muted text-center py-6">No pending requests 🎉</p>
        )}
        {requests.map((req) => (
          <div key={req.id} className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                {req.initials}
              </div>
              <div>
                <p className="font-semibold text-foreground">{req.patient}</p>
                <p className="text-sm text-muted">{req.requested}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleApprove(req.id)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-5 py-2 rounded-lg"
              >
                Approve
              </button>
              <button
                onClick={() => handleDecline(req.id)}
                className="border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm px-5 py-2 rounded-lg"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manage Availability */}
      <AvailabilityGrid />
    </div>
  );
}