"use client";

import { useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timeSlots = ["8 – 9 AM", "9 – 10 AM", "10 – 11 AM", "1 – 2 PM", "2 – 3 PM", "3 – 4 PM"];

// Dummy initial state — backend se GET /api/provider/availability se aayega
const initialAvailability: Record<string, boolean> = {
  "Mon-8 – 9 AM": true, "Tue-8 – 9 AM": true, "Wed-8 – 9 AM": true, "Thu-8 – 9 AM": false, "Fri-8 – 9 AM": true,
  "Mon-9 – 10 AM": true, "Tue-9 – 10 AM": true, "Wed-9 – 10 AM": true, "Thu-9 – 10 AM": true, "Fri-9 – 10 AM": true,
  "Mon-10 – 11 AM": false, "Tue-10 – 11 AM": true, "Wed-10 – 11 AM": true, "Thu-10 – 11 AM": true, "Fri-10 – 11 AM": false,
  "Mon-1 – 2 PM": true, "Tue-1 – 2 PM": true, "Wed-1 – 2 PM": false, "Thu-1 – 2 PM": true, "Fri-1 – 2 PM": true,
  "Mon-2 – 3 PM": true, "Tue-2 – 3 PM": false, "Wed-2 – 3 PM": true, "Thu-2 – 3 PM": true, "Fri-2 – 3 PM": true,
  "Mon-3 – 4 PM": false, "Tue-3 – 4 PM": true, "Wed-3 – 4 PM": true, "Thu-3 – 4 PM": false, "Fri-3 – 4 PM": true,
};

export default function AvailabilityGrid() {
  const [availability, setAvailability] = useState(initialAvailability);

  const toggleSlot = (key: string) => {
    setAvailability((prev) => ({ ...prev, [key]: !prev[key] }));
    // backend se wire karte waqt yahan PUT /api/provider/availability call hoga
  };

  return (
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
              {days.map((d) => (
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
                {days.map((day) => {
                  const key = `${day}-${slot}`;
                  const isAvailable = availability[key];
                  return (
                    <td key={key} className="px-1.5 py-1.5">
                      <button
                        onClick={() => toggleSlot(key)}
                        className={`w-full h-10 rounded-lg flex items-center justify-center transition-colors ${
                          isAvailable
                            ? "bg-primary text-white"
                            : "border border-gray-300 text-transparent hover:bg-gray-50"
                        }`}
                      >
                        {isAvailable && "✓"}
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
  );
}