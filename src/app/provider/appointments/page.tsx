"use client";

import { useState, useEffect } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";

type ApptStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

interface Patient {
  id: number;
  name: string;
}

interface Appointment {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: ApptStatus;
  notes: string | null;
  patient: Patient;
}

interface AppointmentsResponse {
  appointments: Appointment[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

const statusStyles: Record<ApptStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-pink-100 text-rose-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-200 text-gray-600",
};

const statusLabels: Record<ApptStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const PAGE_SIZE = 6;

export default function ProviderAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiFetch<AppointmentsResponse>("/provider/appointments", { token })
      .then((data) => {
        setAppointments(data.appointments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load appointments:", err);
        setError("Could not load appointments.");
        setLoading(false);
      });
  }, []);

  const handleAction = async (
    id: number,
    action: "approve" | "decline" | "complete"
  ) => {
    setActionError("");
    const token = getToken();
    const newStatus: ApptStatus =
      action === "approve" ? "CONFIRMED" :
      action === "complete" ? "COMPLETED" : "CANCELLED";

    try {
      await apiFetch(`/provider/appointments/${id}/${action}`, {
        method: "PUT",
        token: token || undefined,
      });
      setAppointments((prev) =>
        prev.map((a) => a.id === id ? { ...a, status: newStatus } : a)
      );
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message);
      } else {
        setActionError("Action failed. Please try again.");
      }
    }
  };

  const totalPages = Math.max(1, Math.ceil(appointments.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = appointments.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
      <p className="text-muted mt-1 mb-6">{appointments.length} appointments</p>

      {actionError && (
        <p className="text-red-600 mb-4">{actionError}</p>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-muted">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-muted">No appointments found.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {pageItems.map((appt) => (
              <div
                key={appt.id}
                className="bg-card rounded-2xl shadow-sm p-5 flex items-center justify-between flex-wrap gap-3"
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                    {getInitials(appt.patient.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{appt.patient.name}</p>
                    <p className="text-sm text-muted">{appt.notes || "—"}</p>
                  </div>
                </div>

                <div className="min-w-[160px]">
                  <p className="text-sm font-medium text-foreground">{formatDate(appt.date)}</p>
                  <p className="text-sm text-muted">{appt.startTime} – {appt.endTime}</p>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyles[appt.status]}`}>
                    {statusLabels[appt.status]}
                  </span>
                  <div className="flex items-center gap-3 pl-2">
                    {appt.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleAction(appt.id, "approve")}
                          className="bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-4 py-2 rounded-lg whitespace-nowrap"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(appt.id, "decline")}
                          className="border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm px-4 py-2 rounded-lg whitespace-nowrap"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {appt.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleAction(appt.id, "complete")}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-lg whitespace-nowrap"
                      >
                        Complete
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

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted">
              Showing {start + 1}–{Math.min(start + PAGE_SIZE, appointments.length)} of {appointments.length}
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
        </>
      )}
    </div>
  );
}