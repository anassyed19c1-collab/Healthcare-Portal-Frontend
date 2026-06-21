import AppointmentCard from "@/components/AppointmentCard";
import StatusBadge from "@/components/StatusBadge";

const upcomingAppointments = [
  {
    providerName: "Dr. Anita Rao",
    specialization: "Cardiology",
    status: "CONFIRMED" as const,
    date: "Mon, Jun 22, 2026",
    time: "10:30 AM",
    location: "Suite 204",
  },
  {
    providerName: "Dr. James Okoro",
    specialization: "Dermatology",
    status: "PENDING" as const,
    date: "Thu, Jun 25, 2026",
    time: "2:00 PM",
    location: "Telehealth",
  },
  {
    providerName: "Dr. Lena Schmidt",
    specialization: "Primary Care",
    status: "CONFIRMED" as const,
    date: "Tue, Jun 30, 2026",
    time: "9:15 AM",
    location: "Suite 110",
  },
];

const history = [
  { provider: "Dr. Lena Schmidt", date: "May 28, 2026", status: "COMPLETED" as const },
  { provider: "Dr. Anita Rao", date: "May 12, 2026", status: "COMPLETED" as const },
  { provider: "Dr. Marcus Bell", date: "Apr 30, 2026", status: "CANCELLED" as const },
  { provider: "Dr. James Okoro", date: "Apr 16, 2026", status: "COMPLETED" as const },
];

export default function PatientDashboard() {
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted mt-1">
            Welcome back, Eleanor. Here&apos;s what&apos;s coming up.
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg">
          + Book New Appointment
        </button>
      </div>

      <h2 className="text-lg font-bold text-foreground mb-4">
        Upcoming Appointments
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {upcomingAppointments.map((appt, i) => (
          <AppointmentCard key={i} {...appt} />
        ))}
      </div>

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
            {history.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                <td className="px-5 py-4 font-semibold text-foreground">
                  {row.provider}
                </td>
                <td className="px-5 py-4 text-foreground">{row.date}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-primary font-semibold hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}