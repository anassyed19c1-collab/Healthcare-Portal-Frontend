"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Stepper from "@/components/Stepper";

const providers = [
  { id: 1, name: "Dr. Anita Rao", specialization: "Cardiology", initials: "AR", next: "Jun 22" },
  { id: 2, name: "Dr. James Okoro", specialization: "Dermatology", initials: "JO", next: "Jun 25" },
  { id: 3, name: "Dr. Lena Schmidt", specialization: "Primary Care", initials: "LS", next: "Jun 19" },
];

// Dummy available dates for June 2026 (din ke numbers) — backend se aayega Availability table se
const availableDays = [18, 19, 20, 22, 23, 24, 25, 26, 27, 29, 30];
const availableTimes = [
  "9:00 AM", "9:45 AM", "10:30 AM", "11:15 AM",
  "1:00 PM", "2:00 PM", "3:15 PM", "4:00 PM",
];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  return cells;
}

export default function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<typeof providers[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const year = 2026;
  const month = 5; // June (0-indexed)
  const monthLabel = "June 2026";
  const calendarDays = getCalendarDays(year, month);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleSelectProvider = (p: typeof providers[0]) => {
    setSelectedProvider(p);
    setStep(2);
  };

  const handleConfirmBooking = () => {
    // backend se wire karte waqt yahan POST /api/patient/appointments call hoga
    console.log("Booking confirmed:", {
      provider: selectedProvider,
      date: selectedDate,
      time: selectedTime,
      reason,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Book an Appointment
      </h1>

      <Stepper currentStep={step} />

      {/* Step 1: Select Provider */}
      {step === 1 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">
              Select a Provider
            </h2>
            <div>
              <label className="block text-sm text-muted mb-1">
                Filter by specialty
              </label>
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary">
                <option>All specialties</option>
                <option>Cardiology</option>
                <option>Dermatology</option>
                <option>Primary Care</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {providers.map((p) => (
              <div
                key={p.id}
                className="bg-card rounded-2xl shadow-sm p-5 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                    {p.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{p.name}</p>
                    <p className="text-sm text-muted">{p.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-muted">
                    Next: {p.next}
                  </span>
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
        </div>
      )}

      {/* Step 2: Select Date & Time */}
      {step === 2 && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">
            Select Date & Time
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
            {/* Calendar */}
            <div className="bg-card rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <button className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-muted">
                  <ChevronLeft size={16} />
                </button>
                <span className="font-bold text-foreground">{monthLabel}</span>
                <button className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-muted">
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
                  const isAvailable = availableDays.includes(day);
                  const isSelected = selectedDate === day;
                  return (
                    <button
                      key={i}
                      disabled={!isAvailable}
                      onClick={() => setSelectedDate(day)}
                      className={`h-10 rounded-lg text-sm font-medium border ${
                        isSelected
                          ? "bg-primary text-white border-primary"
                          : isAvailable
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

            {/* Available times */}
            <div className="bg-card rounded-2xl shadow-sm p-6 h-fit">
              <h3 className="font-bold text-foreground mb-4">Available times</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableTimes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2.5 rounded-lg text-sm font-medium border ${
                      selectedTime === t
                        ? "bg-primary text-white border-primary"
                        : "border-gray-300 text-foreground hover:border-primary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
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
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && selectedProvider && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">
            Confirm Your Appointment
          </h2>
          <div className="bg-card rounded-2xl shadow-sm p-6 max-w-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                {selectedProvider.initials}
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {selectedProvider.name}
                </p>
                <p className="text-sm text-muted">
                  {selectedProvider.specialization}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 my-4">
              <div className="bg-background rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-muted uppercase">Date</p>
                <p className="font-semibold text-foreground">
                  {monthLabel.split(" ")[0]} {selectedDate}, {year}
                </p>
              </div>
              <div className="bg-background rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-muted uppercase">Time</p>
                <p className="font-semibold text-foreground">{selectedTime}</p>
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
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}