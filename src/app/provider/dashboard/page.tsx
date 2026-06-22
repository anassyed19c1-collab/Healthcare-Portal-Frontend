"use client";

import { useState, useEffect } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface Patient {
  id: number;
  name: string;
  phone?: string;
}

interface Appointment {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes: string | null;
  patient: Patient;
}

interface AppointmentsResponse {
  appointments: Appointment[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

interface AvailabilityEntry {
  id: number;
  dayOfWeek: number | null;
  date: string | null;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface AvailabilityResponse {
  availability: AvailabilityEntry[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

const timeToIndex: Record<string, number> = {
  "8:00 AM": 8, "9:00 AM": 9, "10:00 AM": 10, "11:00 AM": 11,
  "1:00 PM": 13, "2:00 PM": 14, "3:00 PM": 15, "4:00 PM": 16,
};

export default function ProviderDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availability, setAvailability] = useState<AvailabilityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    Promise.all([
      apiFetch<AppointmentsResponse>("/provider/appointments", { token }),
      apiFetch<AvailabilityResponse>("/provider/availability", { token }),
    ])
      .then(([apptData, availData]) => {
        setAppointments(apptData.appointments || []);
        setAvailability(availData.availability || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard load error:", err);
        setError("Could not load dashboard data.");
        setLoading(false);
      });
  }, []);

  const today = new Date().toDateString();

  const todayAppointments = appointments.filter(
    (a) => new Date(a.date).toDateString() === today &&
      (a.status === "CONFIRMED" || a.status === "PENDING")
  );

  const pendingRequests = appointments.filter((a) => a.status === "PENDING");

  const handleApprove = async (id: number) => {
    const token = getToken();
    try {
      await apiFetch(`/provider/appointments/${id}/approve`, {
        method: "PUT",
        token: token || undefined,
      });
      setAppointments((prev) =>
        prev.map((a) => a.id === id ? { ...a, status: "CONFIRMED" } : a)
      );
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    }
  };

  const handleDecline = async (id: number) => {
    const token = getToken();
    try {
      await apiFetch(`/provider/appointments/${id}/decline`, {
        method: "PUT",
        token: token || undefined,
      });
      setAppointments((prev) =>
        prev.map((a) => a.id === id ? { ...a, status: "CANCELLED" } : a)
      );
    } catch (err) {
      if (err instanceof ApiError) alert(err.message);
    }
  };

  // Availability grid logic
  const isSlotAvailable = (day: string, timeLabel: string) => {
    const dayIndex = days.indexOf(day);
    const hour = timeToIndex[timeLabel];
    return availability.some(
      (a) =>
        a.isAvailable &&
        a.dayOfWeek === dayIndex &&
        parseInt(a.startTime.split(":")[0]) <= hour &&
        parseInt(a.endTime.split(":")[0]) > hour
    );
  };

  const toggleSlot = async (day: string, timeLabel: string) => {
    // backend wire karte waqt: PUT /api/provider/availability
    console.log("Toggle slot:", day, timeLabel);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <h1 className="text-2xl font-bold text-foreground">
        Good morning, Dr. Smith
      </h1>
      <p className="text-muted mt-1 mb-8">
        You have {todayAppointments.length} appointments today and{" "}
        {pendingRequests.length} requests awaiting review.
      </p>

      {/* Today's Appointments */}
      <h2 className="text-lg font-bold text-foreground mb-4">
        Today&apos;s Appointments
      </h2>
      {todayAppointments.length === 0 ? (
        <p className="text-muted mb-10">No appointments today.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {todayAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-card rounded-2xl shadow-sm p-5 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                    {getInitials(appt.patient.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {appt.patient.name}
                    </p>
                    <p className="text-sm text-muted">{appt.notes || "—"}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    appt.status === "CONFIRMED"
                      ? "bg-pink-100 text-rose-700"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {appt.status === "CONFIRMED" ? "Confirmed" : "Pending"}
                </span>
              </div>
              <div className="bg-background rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="font-medium text-foreground text-sm">
                  {appt.startTime}
                </span>
                <span className="text-sm text-muted">{formatDate(appt.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Requests */}
      <h2 className="text-lg font-bold text-foreground mb-4">
        Pending Requests
      </h2>
      <div className="bg-card rounded-2xl shadow-sm divide-y divide-gray-100 mb-10">
        {pendingRequests.length === 0 ? (
          <p className="text-muted text-center py-6">No pending requests 🎉</p>
        ) : (
          pendingRequests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                  {getInitials(req.patient.name)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {req.patient.name}
                  </p>
                  <p className="text-sm text-muted">
                    Requested {formatDate(req.date)} · {req.startTime}
                  </p>
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
          ))
        )}
      </div>

      {/* Manage Availability Grid */}
      <div className="bg-card rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-foreground">Manage Availability</h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2 text-foreground">
              <span className="w-4 h-4 rounded bg-primary inline-block" /> Available
            </span>
            <span className="flex items-center gap-2 text-foreground">
              <span className="w-4 h-4 rounded border border-gray-300 inline-block" /> Unavailable
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-24" />
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
                  <th key={d} className="text-sm font-semibold text-foreground pb-3">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot}>
                  <td className="text-sm text-muted pr-4 py-1.5 whitespace-nowrap">
                    {slot}
                  </td>
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
                    const available = isSlotAvailable(day, slot);
                    return (
                      <td key={day} className="px-1.5 py-1.5">
                        <button
                          onClick={() => toggleSlot(day, slot)}
                          className={`w-full h-10 rounded-lg flex items-center justify-center transition-colors ${
                            available
                              ? "bg-primary text-white"
                              : "border border-gray-300 text-transparent hover:bg-gray-50"
                          }`}
                        >
                          {available && "✓"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted mt-4">
          Tap any slot to toggle your availability.
        </p>
      </div>
    </div>
  );
}