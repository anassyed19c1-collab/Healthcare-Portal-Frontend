"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SlotType = "available" | "unavailable" | "booked";

interface Slot {
  type: SlotType;
  patient?: string;
}

const days = [
  { key: "Mon", label: "Mon", date: "Jun 15" },
  { key: "Tue", label: "Tue", date: "Jun 16" },
  { key: "Wed", label: "Wed", date: "Jun 17" },
  { key: "Thu", label: "Thu", date: "Jun 18" },
  { key: "Fri", label: "Fri", date: "Jun 19" },
  { key: "Sat", label: "Sat", date: "Jun 20" },
  { key: "Sun", label: "Sun", date: "Jun 21" },
];

const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

// Dummy week data — backend se GET /api/provider/availability + appointments se combine hoga
const weekData: Record<string, Record<string, Slot>> = {
  Mon: { "8:00 AM": { type: "available" }, "9:00 AM": { type: "available" }, "10:00 AM": { type: "available" }, "11:00 AM": { type: "unavailable" }, "1:00 PM": { type: "available" }, "2:00 PM": { type: "available" }, "3:00 PM": { type: "available" }, "4:00 PM": { type: "available" } },
  Tue: { "8:00 AM": { type: "available" }, "9:00 AM": { type: "booked", patient: "R. Tan" }, "10:00 AM": { type: "available" }, "11:00 AM": { type: "unavailable" }, "1:00 PM": { type: "available" }, "2:00 PM": { type: "booked", patient: "M. Lee" }, "3:00 PM": { type: "available" }, "4:00 PM": { type: "available" } },
  Wed: { "8:00 AM": { type: "available" }, "9:00 AM": { type: "available" }, "10:00 AM": { type: "booked", patient: "G. Park" }, "11:00 AM": { type: "unavailable" }, "1:00 PM": { type: "available" }, "2:00 PM": { type: "available" }, "3:00 PM": { type: "available" }, "4:00 PM": { type: "unavailable" } },
  Thu: { "8:00 AM": { type: "available" }, "9:00 AM": { type: "available" }, "10:00 AM": { type: "available" }, "11:00 AM": { type: "unavailable" }, "1:00 PM": { type: "booked", patient: "S. Ortega" }, "2:00 PM": { type: "available" }, "3:00 PM": { type: "available" }, "4:00 PM": { type: "available" } },
  Fri: { "8:00 AM": { type: "available" }, "9:00 AM": { type: "available" }, "10:00 AM": { type: "booked", patient: "D. Huang" }, "11:00 AM": { type: "unavailable" }, "1:00 PM": { type: "available" }, "2:00 PM": { type: "available" }, "3:00 PM": { type: "booked", patient: "K. Adams" }, "4:00 PM": { type: "available" } },
  Sat: { "8:00 AM": { type: "unavailable" }, "9:00 AM": { type: "unavailable" }, "10:00 AM": { type: "unavailable" }, "11:00 AM": { type: "unavailable" }, "1:00 PM": { type: "unavailable" }, "2:00 PM": { type: "unavailable" }, "3:00 PM": { type: "unavailable" }, "4:00 PM": { type: "unavailable" } },
  Sun: { "8:00 AM": { type: "unavailable" }, "9:00 AM": { type: "unavailable" }, "10:00 AM": { type: "unavailable" }, "11:00 AM": { type: "unavailable" }, "1:00 PM": { type: "unavailable" }, "2:00 PM": { type: "unavailable" }, "3:00 PM": { type: "unavailable" }, "4:00 PM": { type: "unavailable" } },
};

const recurringAvailability = [
  { day: "Monday", hours: "9:00 AM – 5:00 PM" },
  { day: "Tuesday", hours: "9:00 AM – 5:00 PM" },
  { day: "Wednesday", hours: "9:00 AM – 1:00 PM" },
  { day: "Thursday", hours: "9:00 AM – 5:00 PM" },
  { day: "Friday", hours: "9:00 AM – 4:00 PM" },
  { day: "Saturday", hours: null },
  { day: "Sunday", hours: null },
];

// Dummy month data — backend se GET /api/provider/appointments (grouped by date) se aayega
const monthCells: { day: number | null; weekday: number; booked?: number; open?: boolean }[] = [
  ...Array(1).fill({ day: null, weekday: 0 }),
  { day: 1, weekday: 1, booked: 2 }, { day: 2, weekday: 2, booked: 4 }, { day: 3, weekday: 3, booked: 1 }, { day: 4, weekday: 4, booked: 3 }, { day: 5, weekday: 5, open: true }, { day: 6, weekday: 6 },
  { day: 7, weekday: 0 }, { day: 8, weekday: 1, booked: 1 }, { day: 9, weekday: 2, booked: 3 }, { day: 10, weekday: 3, open: true }, { day: 11, weekday: 4, booked: 2 }, { day: 12, weekday: 5, booked: 4 }, { day: 13, weekday: 6 },
  { day: 14, weekday: 0 }, { day: 15, weekday: 1, open: true }, { day: 16, weekday: 2, booked: 2 }, { day: 17, weekday: 3, booked: 4 }, { day: 18, weekday: 4, booked: 1 }, { day: 19, weekday: 5, booked: 3 }, { day: 20, weekday: 6 },
  { day: 21, weekday: 0 }, { day: 22, weekday: 1, booked: 4 }, { day: 23, weekday: 2, booked: 1 }, { day: 24, weekday: 3, booked: 3 }, { day: 25, weekday: 4, open: true }, { day: 26, weekday: 5, booked: 2 }, { day: 27, weekday: 6 },
  { day: 28, weekday: 0 }, { day: 29, weekday: 1, booked: 3 }, { day: 30, weekday: 2, open: true },
];

const slotStyles: Record<SlotType, string> = {
  available: "bg-primary text-white",
  unavailable: "border border-gray-300 bg-card",
  booked: "bg-pink-100 text-rose-700 font-semibold",
};

export default function MySchedulePage() {
  const [view, setView] = useState<"week" | "month">("week");
  const [selectedDay, setSelectedDay] = useState(18);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Schedule</h1>
        <div className="flex bg-card border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setView("week")}
            className={`px-5 py-2 text-sm font-semibold ${view === "week" ? "bg-primary text-white" : "text-foreground"}`}
          >
            Week
          </button>
          <button
            onClick={() => setView("month")}
            className={`px-5 py-2 text-sm font-semibold ${view === "month" ? "bg-primary text-white" : "text-foreground"}`}
          >
            Month
          </button>
        </div>
      </div>

      {view === "week" ? (
        <div className="bg-card rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-muted">
                <ChevronLeft size={16} />
              </button>
              <span className="font-bold text-foreground">Jun 15 – Jun 21, 2026</span>
              <button className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-muted">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2 text-foreground">
                <span className="w-4 h-4 rounded bg-primary inline-block" /> Available
              </span>
              <span className="flex items-center gap-2 text-foreground">
                <span className="w-4 h-4 rounded border border-gray-300 inline-block" /> Unavailable
              </span>
              <span className="flex items-center gap-2 text-foreground">
                <span className="w-4 h-4 rounded bg-pink-200 inline-block" /> Booked
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="w-20" />
                  {days.map((d) => (
                    <th key={d.key} className="text-sm pb-3">
                      <div className="font-semibold text-foreground">{d.label}</div>
                      <div className="text-muted font-normal">{d.date}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time}>
                    <td className="text-sm text-muted pr-3 py-1.5 whitespace-nowrap">{time}</td>
                    {days.map((d) => {
                      const slot = weekData[d.key][time];
                      return (
                        <td key={d.key} className="px-1.5 py-1.5">
                          <button
                            className={`w-full h-10 rounded-lg text-xs flex items-center justify-center ${slotStyles[slot.type]}`}
                          >
                            {slot.type === "booked" ? slot.patient : ""}
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
            Tap an available or unavailable slot to toggle it. Booked slots show the patient.
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-muted">
                <ChevronLeft size={16} />
              </button>
              <span className="font-bold text-foreground">June 2026</span>
              <button className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-muted">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2 text-foreground">
                <span className="w-4 h-4 rounded bg-primary inline-block" /> Available
              </span>
              <span className="flex items-center gap-2 text-foreground">
                <span className="w-4 h-4 rounded border border-gray-300 inline-block" /> Unavailable
              </span>
              <span className="flex items-center gap-2 text-foreground">
                <span className="w-4 h-4 rounded bg-pink-200 inline-block" /> Booked
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center text-sm font-semibold text-muted mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {monthCells.map((cell, i) => {
              if (!cell.day) return <div key={i} className="h-24 rounded-lg bg-background/50" />;
              const isSelected = cell.day === selectedDay;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(cell.day!)}
                  className="h-24 rounded-lg border border-gray-200 p-2 text-left hover:border-primary"
                >
                  <span
                    className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-sm font-semibold mb-2 ${
                      isSelected ? "bg-primary text-white" : "text-foreground"
                    }`}
                  >
                    {cell.day}
                  </span>
                  {cell.booked ? (
                    <span className="block bg-pink-100 text-rose-700 text-xs font-semibold rounded-full px-2 py-0.5 w-fit">
                      {cell.booked} booked
                    </span>
                  ) : cell.open ? (
                    <span className="block text-primary text-xs font-semibold">Open</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recurring Availability */}
      <h2 className="text-lg font-bold text-foreground mb-4">Recurring Availability</h2>
      <div className="bg-card rounded-2xl shadow-sm divide-y divide-gray-100 mb-8">
        {recurringAvailability.map((item) => (
          <div key={item.day} className="flex items-center justify-between px-6 py-4">
            <span className="font-semibold text-foreground w-32">{item.day}</span>
            <span className={item.hours ? "text-foreground" : "text-muted"}>
              {item.hours ?? "Unavailable"}
            </span>
            <button className="border border-gray-300 text-primary text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-primary/5">
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Block Time Off */}
      <h2 className="text-lg font-bold text-foreground mb-4">Block Time Off</h2>
      <div className="bg-card rounded-2xl shadow-sm p-6 flex items-end gap-4 flex-wrap">
        <div>
          <label className="block text-sm text-muted mb-1">From</label>
          <input
            type="date"
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">To</label>
          <input
            type="date"
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm text-muted mb-1">Reason (optional)</label>
          <input
            type="text"
            placeholder="e.g., Conference, vacation"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg whitespace-nowrap">
          Request Time Off
        </button>
      </div>
    </div>
  );
}