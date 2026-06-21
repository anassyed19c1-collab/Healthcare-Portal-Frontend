import { Users, Stethoscope, ClipboardList, Hourglass, BarChart3 } from "lucide-react";

const stats = [
  { label: "Total Patients", value: "2,481", sub: "+34 this week", icon: Users },
  { label: "Total Providers", value: "57", sub: "Across 9 specialties", icon: Stethoscope },
  { label: "Today's Appointments", value: "186", sub: "42 still upcoming", icon: ClipboardList },
  { label: "Pending Requests", value: "12", sub: "Awaiting provider review", icon: Hourglass },
];

const quickLinks = [
  {
    title: "Users",
    description: "View and manage patient accounts, reset access, and handle support requests.",
    cta: "Go to Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Providers",
    description: "Onboard new providers, manage credentials, and assign specialties.",
    cta: "Go to Providers",
    href: "/admin/providers",
    icon: Stethoscope,
  },
  {
    title: "Reports",
    description: "Review appointment volume, utilization, and portal activity reports.",
    cta: "Go to Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Welcome back, Carla</h1>
      <p className="text-muted mt-1 mb-8">
        Here&apos;s an overview of the portal as of Thursday, June 18, 2026.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="bg-card rounded-2xl shadow-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm text-muted">{label}</p>
              <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <Icon size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
            <p className="text-sm text-muted">{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="text-lg font-bold text-foreground mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {quickLinks.map(({ title, description, cta, href, icon: Icon }) => (
          <div key={title} className="bg-card rounded-2xl shadow-sm p-6 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white mb-4">
              <Icon size={22} />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted mb-5 flex-1">{description}</p>
            <a
              href={href}
              className="bg-primary hover:bg-primary-dark text-white font-semibold text-sm text-center px-4 py-2.5 rounded-lg"
            >
              {cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}