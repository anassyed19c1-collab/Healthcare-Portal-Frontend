"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";

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

const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
const timeToHour: Record<string, number> = {
  "8:00 AM": 8, "9:00 AM": 9, "10:00 AM": 10, "11:00 AM": 11,
  "1:00 PM": 13, "2:00 PM": 14, "3:00 PM": 15, "4:00 PM": 16,
};

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  return cells;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function MySchedulePage() {
  const [view, setView] = useState<"week" | "month">("week");
  const [availability, setAvailability] = useState<AvailabilityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  const [blockForm, setBlockForm] = useState({ from: "", to: "", reason: "" });
  const [blocking, setBlocking] = useState(false);
  const [blockError, setBlockError] = useState("");
  const [blockSuccess, setBlockSuccess] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiFetch<AvailabilityResponse>("/provider/availability", { token })
      .then((data) => {
        setAvailability(data.availability || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load availability:", err);
        setError("Could not load schedule.");
        setLoading(false);
      });
  }, []);

  const isSlotAvailable = (dayIndex: number, timeLabel: string) => {
    const hour = timeToHour[timeLabel];
    return availability.some(
      (a) =>
        a.isAvailable &&
        a.dayOfWeek === dayIndex &&
        parseInt(a.startTime.split(":")[0]) <= hour &&
        parseInt(a.endTime.split(":")[0]) > hour
    );
  };

  const handleBlockTimeOff = async () => {
    if (!blockForm.from || !blockForm.to) {
      setBlockError("Please select both From and To dates.");
      return;
    }
    setBlockError("");
    setBlockSuccess("");
    setBlocking(true);

    try {
      const token = getToken();
      await apiFetch("/provider/availability/block", {
        method: "POST",
        token: token || undefined,
        body: {
          date: blockForm.from,
          startTime: "00:00",
          endTime: "23:59",
          reason: blockForm.reason || undefined,
        },
      });
      setBlockSuccess("Time off blocked successfully.");
      setBlockForm({ from: "", to: "", reason: "" });

      // Reload availability
      const data = await apiFetch<AvailabilityResponse>("/provider/availability", {
        token: token || undefined,
      });
      setAvailability(data.availability || []);
    } catch (err) {
      if (err instanceof ApiError) {
        setBlockError(err.message);
      } else {
        setBlockError("Could not block time off. Please try again.");
      }
    } finally {
      setBlocking(false);
    }
  };

  const recurringEntries = availability.filter(
    (a) => a.isAvailable && a.dayOfWeek !== null
  );

  const getRecurringForDay = (dayIndex: number) => {
    const entries = recurringEntries.filter((a) => a.dayOfWeek === dayIndex);
    if (entries.length === 0) return null;
    const sorted = entries.sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
    return `${sorted[0].startTime} – ${sorted[sorted.length - 1].endTime}`;
  };

  const calendarDays = getCalendarDays(viewYear, viewMonth);

  if (loading) return <p className="text-muted">Loading schedule...</p>;

  return (
    <div>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Schedule</h1>
        <div className="flex bg-card border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setView("week")}
            className={`px-5 py-2 text-sm font-semibold ${
              view === "week" ? "bg-primary text-white" : "text-foreground"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView("month")}
            className={`px-5 py-2 text-sm font-semibold ${
              view === "month" ? "bg-primary text-white" : "text-foreground"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Week View */}
      {view === "week" && (
        <div className="bg-card rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="font-bold text-foreground">Weekly Availability</span>
            </div>
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
                    {[1, 2, 3, 4, 5].map((dayIndex) => {
                      const available = isSlotAvailable(dayIndex, slot);
                      return (
                        <td key={dayIndex} className="px-1.5 py-1.5">
                          <div
                            className={`w-full h-10 rounded-lg flex items-center justify-center ${
                              available
                                ? "bg-primary text-white"
                                : "border border-gray-200 bg-gray-50"
                            }`}
                          >
                            {available && "✓"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted mt-4">
            Availability is based on your recurring weekly schedule below.
          </p>
        </div>
      )}

      {/* Month View */}
      {view === "month" && (
        <div className="bg-card rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
                  else setViewMonth((m) => m - 1);
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
                  if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
                  else setViewMonth((m) => m + 1);
                }}
                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-muted"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center text-sm font-semibold text-muted mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, i) => {
              if (!day) return <div key={i} className="h-20 rounded-lg bg-background/50" />;
              const date = new Date(viewYear, viewMonth, day);
              const weekday = date.getDay();
              const hasAvailability = recurringEntries.some(
                (a) => a.dayOfWeek === weekday
              );
              const isBlocked = availability.some(
                (a) =>
                  !a.isAvailable &&
                  a.date &&
                  new Date(a.date).toDateString() === date.toDateString()
              );
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={i}
                  className="h-20 rounded-lg border border-gray-200 p-2 text-left"
                >
                  <span
                    className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-sm font-semibold mb-1 ${
                      isToday ? "bg-primary text-white" : "text-foreground"
                    }`}
                  >
                    {day}
                  </span>
                  {isBlocked ? (
                    <span className="block text-xs text-red-500 font-semibold">Blocked</span>
                  ) : hasAvailability ? (
                    <span className="block text-xs text-primary font-semibold">Available</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recurring Availability */}
      <h2 className="text-lg font-bold text-foreground mb-4">Recurring Availability</h2>
      <div className="bg-card rounded-2xl shadow-sm divide-y divide-gray-100 mb-8">
        {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
          const hours = getRecurringForDay(dayIndex);
          return (
            <div key={dayIndex} className="flex items-center justify-between px-6 py-4">
              <span className="font-semibold text-foreground w-32">
                {fullDayNames[dayIndex]}
              </span>
              <span className={hours ? "text-foreground" : "text-muted"}>
                {hours ?? "Unavailable"}
              </span>
              <button className="border border-gray-300 text-primary text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-primary/5">
                Edit
              </button>
            </div>
          );
        })}
      </div>

      {/* Block Time Off */}
      <h2 className="text-lg font-bold text-foreground mb-4">Block Time Off</h2>
      <div className="bg-card rounded-2xl shadow-sm p-6">
        {blockError && <p className="text-red-600 mb-4">{blockError}</p>}
        {blockSuccess && <p className="text-green-600 mb-4">{blockSuccess}</p>}

        <div className="flex items-end gap-4 flex-wrap">
          <div>
            <label className="block text-sm text-muted mb-1">From</label>
            <input
              type="date"
              value={blockForm.from}
              onChange={(e) => setBlockForm({ ...blockForm, from: e.target.value })}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">To</label>
            <input
              type="date"
              value={blockForm.to}
              onChange={(e) => setBlockForm({ ...blockForm, to: e.target.value })}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-muted mb-1">Reason (optional)</label>
            <input
              type="text"
              value={blockForm.reason}
              onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
              placeholder="e.g., Conference, vacation"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleBlockTimeOff}
            disabled={blocking}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg whitespace-nowrap disabled:opacity-50"
          >
            {blocking ? "Blocking..." : "Request Time Off"}
          </button>
        </div>
      </div>
    </div>
  );
}