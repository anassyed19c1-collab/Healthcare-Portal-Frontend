"use client";

import { useEffect, useState } from "react";
import AppointmentCard from "@/components/AppointmentCard";
import StatusBadge from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

type ApptStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

interface ApiAppointment {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: ApptStatus;
  provider: {
    name: string;
    specialization: string | null;
  };
}

interface AppointmentsResponse {
  appointments: ApiAppointment[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiFetch<AppointmentsResponse>("/patient/appointments", { token })
      .then((data) => {
        setAppointments(data.appointments);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load appointments:", err);
        setError("Could not load your appointments. Please try again.");
        setLoading(false);
      });
  }, []);

  const upcoming = appointments.filter(
    (a) => a.status === "PENDING" || a.status === "CONFIRMED"
  );
  const history = appointments.filter(
    (a) => a.status === "COMPLETED" || a.status === "CANCELLED"
  );

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted mt-1">
            Welcome back! Here&apos;s what&apos;s coming up.
          </p>
        </div>
        <a
          href="/patient/book-appointment"
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg"
        >
          + Book New Appointment
        </a>
      </div>

      {
        error && (
          <p className="text-red-600 mb-6">{error}</p>
        )
      }

      {
        loading ? (
          <p className="text-muted">Loading appointments...</p>
        ) : (
          <>
            <h2 className="text-lg font-bold text-foreground mb-4">
              Upcoming Appointments
            </h2>
            {upcoming.length === 0 ? (
              <p className="text-muted mb-10">No upcoming appointments.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                {upcoming.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    providerName={appt.provider.name}
                    specialization={appt.provider.specialization || ""}
                    status={appt.status}
                    date={formatDate(appt.date)}
                    time={appt.startTime}
                    location="—"
                  />
                ))}
              </div>
            )}

            <h2 className="text-lg font-bold text-foreground mb-4">
              Recent Appointment History
            </h2>
            <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-muted uppercase border-b border-gray-200">
                    <th className="px-5 py-3 font-semibold">Provider</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-muted">
                        No past appointments yet.
                      </td>
                    </tr>
                  ) : (
                    history.map((appt) => (
                      <tr key={appt.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-5 py-4 font-semibold text-foreground">
                          {appt.provider.name}
                        </td>
                        <td className="px-5 py-4 text-foreground">{formatDate(appt.date)}</td>
                        <td className="px-5 py-4">
                          <StatusBadge status={appt.status} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button className="text-primary font-semibold hover:underline">
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )
      }
    </div >
  );
}