"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Stepper from "@/components/Stepper";
import { apiFetch, ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface AvailabilityEntry {
  dayOfWeek: number | null;
  date: string | null;
  startTime: string;
  endTime: string;
}

interface Provider {
  id: number;
  name: string;
  specialization: string | null;
  availability: AvailabilityEntry[];
}

interface ProvidersResponse {
  providers: Provider[];
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

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToLabel(mins: number) {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

function minutesToTime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function generateSlots(entries: AvailabilityEntry[], durationMin = 30) {
  const slots: { startMinutes: number; endMinutes: number; label: string }[] = [];
  entries.forEach((entry) => {
    let start = timeToMinutes(entry.startTime);
    const end = timeToMinutes(entry.endTime);
    while (start + durationMin <= end) {
      slots.push({
        startMinutes: start,
        endMinutes: start + durationMin,
        label: minutesToLabel(start),
      });
      start += durationMin;
    }
  });
  return slots;
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  return cells;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ startMinutes: number; endMinutes: number; label: string } | null>(null);
  const [reason, setReason] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiFetch<ProvidersResponse>("/providers", { token })
      .then((data) => {
        setProviders(data.providers || []);
        setLoadingProviders(false);
      })
      .catch((err) => {
        console.error("Failed to load providers:", err);
        setLoadError("Could not load providers. Please try again.");
        setLoadingProviders(false);
      });
  }, []);

  const handleSelectProvider = (p: Provider) => {
    setSelectedProvider(p);
    setSelectedDay(null);
    setSelectedSlot(null);
    setStep(2);
  };

  const calendarDays = getCalendarDays(viewYear, viewMonth);

  const isDayAvailable = (day: number) => {
    if (!selectedProvider) return false;
    const date = new Date(viewYear, viewMonth, day);
    const weekday = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;
    return selectedProvider.availability.some((a) => a.dayOfWeek === weekday);
  };

  const slotsForSelectedDay =
    selectedProvider && selectedDay
      ? generateSlots(
          selectedProvider.availability.filter(
            (a) => a.dayOfWeek === new Date(viewYear, viewMonth, selectedDay).getDay()
          )
        )
      : [];

  const handleConfirmBooking = async () => {
    if (!selectedProvider || !selectedDay || !selectedSlot) return;
    setSubmitError("");
    setSubmitting(true);

    const dateStr = `${viewYear}-${(viewMonth + 1).toString().padStart(2, "0")}-${selectedDay
      .toString()
      .padStart(2, "0")}`;

    try {
      const token = getToken();
      await apiFetch("/patient/appointments", {
        method: "POST",
        token: token || undefined,
        body: {
          providerId: selectedProvider.id,
          date: dateStr,
          startTime: minutesToTime(selectedSlot.startMinutes),
          endTime: minutesToTime(selectedSlot.endMinutes),
          notes: reason || undefined,
        },
      });
      setBookingDone(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingDone) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Appointment Requested!
        </h1>
        <p className="text-muted mb-6">
          {`Your appointment with ${selectedProvider?.name} has been requested.`}
          You&apos;ll be notified once it&apos;s confirmed.
        </p>
        <a
          href="/patient/appointments"
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg inline-block"
        >
          View My Appointments
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Book an Appointment
      </h1>

      <Stepper currentStep={step} />

      {loadError && <p className="text-red-600 mb-4">{loadError}</p>}

      {/* Step 1: Select Provider */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">
            Select a Provider
          </h2>

          {loadingProviders ? (
            <p className="text-muted">Loading providers...</p>
          ) : providers.length === 0 ? (
            <p className="text-muted">No providers available right now.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {providers.map((p) => (
                <div
                  key={p.id}
                  className="bg-card rounded-2xl shadow-sm p-5 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                      {getInitials(p.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{p.name}</p>
                      <p className="text-sm text-muted">{p.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleSelectProvider(p)}
                      className="text-primary font-semibold text-sm hover:underline"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Date & Time */}
      {step === 2 && selectedProvider && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">
            Select Date & Time
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    if (viewMonth === 0) {
                      setViewMonth(11);
                      setViewYear((y) => y - 1);
                    } else {
                      setViewMonth((m) => m - 1);
                    }
                  }}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-muted"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="font-bold text-foreground">
                  {monthNames[viewMonth]} {viewYear}
                </span>
                <button
                  onClick={() => {
                    if (viewMonth === 11) {
                      setViewMonth(0);
                      setViewYear((y) => y + 1);
                    } else {
                      setViewMonth((m) => m + 1);
                    }
                  }}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-muted"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted mb-2">
                {weekDays.map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, i) => {
                  if (!day) return <div key={i} />;
                  const available = isDayAvailable(day);
                  const isSelected = selectedDay === day;
                  return (
                    <button
                      key={i}
                      disabled={!available}
                      onClick={() => {
                        setSelectedDay(day);
                        setSelectedSlot(null);
                      }}
                      className={`h-10 rounded-lg text-sm font-medium border ${
                        isSelected
                          ? "bg-primary text-white border-primary"
                          : available
                          ? "border-gray-300 text-foreground hover:border-primary"
                          : "border-transparent text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm p-6 h-fit">
              <h3 className="font-bold text-foreground mb-4">Available times</h3>
              {!selectedDay ? (
                <p className="text-sm text-muted">Select a date first.</p>
              ) : slotsForSelectedDay.length === 0 ? (
                <p className="text-sm text-muted">No slots available this day.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {slotsForSelectedDay.map((slot) => (
                    <button
                      key={slot.startMinutes}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 rounded-lg text-sm font-medium border ${
                        selectedSlot?.startMinutes === slot.startMinutes
                          ? "bg-primary text-white border-primary"
                          : "border-gray-300 text-foreground hover:border-primary"
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-foreground font-semibold hover:bg-gray-50"
            >
              Back
            </button>
            <button
              disabled={!selectedDay || !selectedSlot}
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && selectedProvider && selectedDay && selectedSlot && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">
            Confirm Your Appointment
          </h2>

          {submitError && <p className="text-red-600 mb-4">{submitError}</p>}

          <div className="bg-card rounded-2xl shadow-sm p-6 max-w-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                {getInitials(selectedProvider.name)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{selectedProvider.name}</p>
                <p className="text-sm text-muted">{selectedProvider.specialization}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 my-4">
              <div className="bg-background rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-muted uppercase">Date</p>
                <p className="font-semibold text-foreground">
                  {monthNames[viewMonth]} {selectedDay}, {viewYear}
                </p>
              </div>
              <div className="bg-background rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-muted uppercase">Time</p>
                <p className="font-semibold text-foreground">{selectedSlot.label}</p>
              </div>
            </div>

            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Reason for visit
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms or reason for the visit (optional)"
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-y"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-foreground font-semibold hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-50"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}