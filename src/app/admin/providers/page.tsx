"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

type Status = "Active" | "Inactive";

interface ProviderRow {
  id: number;
  name: string;
  initials: string;
  specialty: string;
  email: string;
  license: string;
  status: Status;
}

const initialProviders: ProviderRow[] = [
  { id: 1, name: "Dr. Anita Rao", initials: "AR", specialty: "Cardiology", email: "anita.rao@clinic.example.com", license: "MD-7741920", status: "Active" },
  { id: 2, name: "Dr. James Okoro", initials: "JO", specialty: "Dermatology", email: "james.okoro@clinic.example.com", license: "MD-6620104", status: "Active" },
  { id: 3, name: "Dr. Lena Schmidt", initials: "LS", specialty: "Primary Care", email: "lena.schmidt@clinic.example.com", license: "MD-5390277", status: "Active" },
  { id: 4, name: "Dr. Marcus Bell", initials: "MB", specialty: "Orthopedics", email: "marcus.bell@clinic.example.com", license: "MD-4480915", status: "Inactive" },
  { id: 5, name: "Dr. Priya Nair", initials: "PN", specialty: "Endocrinology", email: "priya.nair@clinic.example.com", license: "MD-7012588", status: "Active" },
  { id: 6, name: "Dr. Tom Alvarez", initials: "TA", specialty: "Pediatrics", email: "tom.alvarez@clinic.example.com", license: "MD-3398421", status: "Active" },
];

const specialties = ["Cardiology", "Dermatology", "Primary Care", "Orthopedics", "Endocrinology", "Pediatrics"];

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState(initialProviders);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    specialty: "Cardiology",
    license: "",
  });

  // backend connect hone par: GET /api/admin/users?role=PROVIDER&search=&specialty=
  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query || p.name.toLowerCase().includes(query) || p.email.toLowerCase().includes(query);
      const matchesSpecialty = specialty === "All specialties" || p.specialty === specialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [providers, search, specialty]);

  const toggleStatus = (id: number) => {
    // backend connect hone par: PUT /api/admin/users/:id/deactivate
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p
      )
    );
  };

  const handleCreateProvider = () => {
    if (!form.name || !form.email || !form.license) {
      alert("Please fill in all required fields");
      return;
    }
    // backend connect hone par: POST /api/admin/users { name, email, specialization, phone? }
    console.log("Creating provider:", form);
    const initials = form.name
      .replace("Dr. ", "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    setProviders((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: form.name,
        initials,
        specialty: form.specialty,
        email: form.email,
        license: form.license,
        status: "Active",
      },
    ]);
    setForm({ name: "", email: "", specialty: "Cardiology", license: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Providers</h1>
          <p className="text-muted mt-1">{filtered.length} providers</p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-lg"
        >
          {showForm ? "Cancel" : "+ Add New Provider"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 my-6 items-end flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <label className="block text-sm text-muted mb-1">Search</label>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Specialty</label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All specialties</option>
            {specialties.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-sm overflow-x-auto mb-10">
        <table className="w-full text-left min-w-[950px]">
          <thead>
            <tr className="text-xs text-muted uppercase border-b border-gray-200 bg-background">
              <th className="px-5 py-3 font-semibold w-[22%]">Name</th>
              <th className="px-5 py-3 font-semibold w-[15%]">Specialty</th>
              <th className="px-5 py-3 font-semibold w-[22%]">Email</th>
              <th className="px-5 py-3 font-semibold w-[12%]">License</th>
              <th className="px-5 py-3 font-semibold w-[10%]">Status</th>
              <th className="px-5 py-3 font-semibold w-[19%] text-right">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted">
                  No providers found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                        {p.initials}
                      </div>
                      <span className="font-semibold text-foreground whitespace-nowrap">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-foreground whitespace-nowrap">{p.specialty}</td>
                  <td className="px-5 py-4 text-foreground truncate max-w-[200px]">{p.email}</td>
                  <td className="px-5 py-4 text-foreground whitespace-nowrap">{p.license}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        p.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                      <button className="text-primary font-semibold text-sm hover:underline w-10 text-left">
                        Edit
                      </button>
                      {p.status === "Active" ? (
                        <button
                          onClick={() => toggleStatus(p.id)}
                          className="border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm px-4 py-1.5 rounded-lg w-28 text-center"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleStatus(p.id)}
                          className="border border-green-300 text-green-700 hover:bg-green-50 font-semibold text-sm px-4 py-1.5 rounded-lg w-28 text-center"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Provider */}
      {showForm && (
        <div className="bg-card rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-1">Add New Provider</h2>
          <p className="text-muted mb-6">
            Create a provider account. They&apos;ll receive an email to set their password.
          </p>

          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Full name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Dr. Jane Doe"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane.doe@clinic.example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Specialty</label>
              <select
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {specialties.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">License number</label>
              <input
                value={form.license}
                onChange={(e) => setForm({ ...form, license: e.target.value })}
                placeholder="MD-0000000"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            onClick={handleCreateProvider}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg"
          >
            Create Provider Account
          </button>
        </div>
      )}
    </div>
  );
}