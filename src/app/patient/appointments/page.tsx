"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { ApiError, apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

type ApptStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
type DisplayStatus = "UPCOMING" | "COMPLETED" | "CANCELLED";

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

function getInitials(name: string) {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

function toDisplayStatus(status: ApptStatus): DisplayStatus {
  if (status === "COMPLETED") return "COMPLETED";
  if (status === "CANCELLED") return "CANCELLED";
  return "UPCOMING"; // PENDING or CONFIRMED
}

const PAGE_SIZE = 5;

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiFetch<AppointmentsResponse>("/patient/appointments", { token })
      .then((data) => {
        setAppointments(data.appointments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load appointments:", err);
        setError("Could not load your appointments. Please try again.");
        setLoading(false);
      });
  }, []);

  const totalPages = Math.max(1, Math.ceil(appointments.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = appointments.slice(start, start + PAGE_SIZE);

  const handleCancel = async (id: number) => {
    const token = getToken();
    try {
      await apiFetch(`/patient/appointments/${id}/cancel`, {
        method: "PUT",
        token: token || undefined,
      });
      setAppointments((prev) =>
        prev.map((a) => a.id === id ? { ...a, status: "CANCELLED" } : a)
      );
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  const handleReschedule = async (id: number) => {
    // Simple prompt se nai date/time lenge abhi
    const newDate = prompt("New date (YYYY-MM-DD):");
    const newStartTime = prompt("New start time (HH:MM):");
    const newEndTime = prompt("New end time (HH:MM):");

    if (!newDate || !newStartTime || !newEndTime) return;

    const token = getToken();
    try {
      await apiFetch(`/patient/appointments/${id}/reschedule`, {
        method: "PUT",
        token: token || undefined,
        body: {
          date: newDate,
          startTime: newStartTime,
          endTime: newEndTime,
        },
      });
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, date: newDate, startTime: newStartTime, endTime: newEndTime, status: "PENDING" }
            : a
        )
      );
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      }
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Appointments</h1>
          <p className="text-muted mt-1">{appointments.length} appointments</p>
        </div>
        <a
          href="/patient/book-appointment"
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg"
        >
          + Book New Appointment
        </a>
      </div>

      {error && <p className="text-red-600 my-4">{error}</p>}

      {loading ? (
        <p className="text-muted mt-6">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-muted mt-6">You have no appointments yet.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3 mt-6">
            {pageItems.map((appt) => {
              const displayStatus = toDisplayStatus(appt.status);
              return (
                <div
                  key={appt.id}
                  className="bg-card rounded-2xl shadow-sm p-5 flex items-center justify-between flex-wrap gap-3"
                >
                  <div className="flex items-center gap-3 min-w-[220px]">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                      {getInitials(appt.provider.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{appt.provider.name}</p>
                      <p className="text-sm text-muted">{appt.provider.specialization}</p>
                    </div>
                  </div>

                  <div className="min-w-[160px]">
                    <p className="text-sm font-medium text-foreground">{formatDate(appt.date)}</p>
                    <p className="text-sm text-muted">{appt.startTime}</p>
                  </div>

                  <div className="flex items-center gap-3 ml-auto">
                    <StatusBadge status={displayStatus} />
                    <div className="flex items-center gap-5 pl-2">
                      {displayStatus === "UPCOMING" && (
                        <>
                          <button
                            onClick={() => handleReschedule(appt.id)}
                            className="text-primary font-semibold text-sm hover:underline whitespace-nowrap"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(appt.id)}
                            className="text-red-600 font-semibold text-sm hover:underline whitespace-nowrap"
                          >
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
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted">
              Showing {start + 1}–{Math.min(start + PAGE_SIZE, appointments.length)} of{" "}
              {appointments.length}
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
                  className={`w-9 h-9 rounded-lg text-sm font-semibold ${p === page ? "bg-primary text-white" : "border border-gray-300 text-foreground hover:bg-gray-50"
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
        </>
      )}
    </div>
  );
}