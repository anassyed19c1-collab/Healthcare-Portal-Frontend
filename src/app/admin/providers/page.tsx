"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface ProviderRow {
  id: number;
  name: string;
  email: string;
  specialization: string | null;
  isActive: boolean;
  phone: string | null;
}

interface UsersResponse {
  users: ProviderRow[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const specialties = [
  "Cardiology", "Dermatology", "Primary Care",
  "Orthopedics", "Endocrinology", "Pediatrics",
];

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "Cardiology",
    phone: "",
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = () => {
    const token = getToken();
    if (!token) return;

    apiFetch<UsersResponse>("/admin/users?role=PROVIDER", { token })
      .then((data) => {
        setProviders(data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load providers:", err);
        setError("Could not load providers.");
        setLoading(false);
      });
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return providers;
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query)
    );
  }, [providers, search]);

  const toggleStatus = async (id: number, currentlyActive: boolean) => {
    setActionError("");
    const token = getToken();
    try {
      await apiFetch(`/admin/users/${id}/deactivate`, {
        method: "PUT",
        token: token || undefined,
      });
      setProviders((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isActive: !currentlyActive } : p
        )
      );
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message);
      } else {
        setActionError("Action failed. Please try again.");
      }
    }
  };

  const handleCreateProvider = async () => {
    if (!form.name || !form.email || !form.password) {
      setCreateError("Name, email and password are required.");
      return;
    }
    setCreateError("");
    setCreateSuccess("");
    setCreating(true);

    try {
      const token = getToken();
      await apiFetch("/admin/users", {
        method: "POST",
        token: token || undefined,
        body: {
          name: form.name,
          email: form.email,
          password: form.password,
          specialization: form.specialty,
          phone: form.phone || undefined,
        },
      });
      setCreateSuccess(`Provider account created for ${form.name}.`);
      setForm({ name: "", email: "", password: "", specialty: "Cardiology", phone: "" });
      setShowForm(false);
      loadProviders();
    } catch (err) {
      if (err instanceof ApiError) {
        setCreateError(err.message);
      } else {
        setCreateError("Could not create provider. Please try again.");
      }
    } finally {
      setCreating(false);
    }
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

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {actionError && <p className="text-red-600 mb-4">{actionError}</p>}
      {createSuccess && <p className="text-green-600 mb-4">{createSuccess}</p>}

      {/* Search */}
      <div className="relative max-w-md my-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {loading ? (
        <p className="text-muted">Loading providers...</p>
      ) : (
        <>
          {/* Table */}
          <div className="bg-card rounded-2xl shadow-sm overflow-x-auto mb-8">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="text-xs text-muted uppercase border-b border-gray-200 bg-background">
                  <th className="px-5 py-3 font-semibold w-[25%]">Name</th>
                  <th className="px-5 py-3 font-semibold w-[18%]">Specialty</th>
                  <th className="px-5 py-3 font-semibold w-[27%]">Email</th>
                  <th className="px-5 py-3 font-semibold w-[12%]">Status</th>
                  <th className="px-5 py-3 font-semibold w-[18%] text-right">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted">
                      No providers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                            {getInitials(p.name)}
                          </div>
                          <span className="font-semibold text-foreground whitespace-nowrap">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-foreground whitespace-nowrap">
                        {p.specialization || "—"}
                      </td>
                      <td className="px-5 py-4 text-foreground truncate max-w-[200px]">
                        {p.email}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          p.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}>
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                          <button className="text-primary font-semibold text-sm hover:underline w-10 text-left">
                            Edit
                          </button>
                          {p.isActive ? (
                            <button
                              onClick={() => toggleStatus(p.id, true)}
                              className="border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm px-4 py-1.5 rounded-lg w-28 text-center"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleStatus(p.id, false)}
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
        </>
      )}

      {/* Add New Provider Form */}
      {showForm && (
        <div className="bg-card rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-1">
            Add New Provider
          </h2>
          <p className="text-muted mb-6">
            Create a provider account with a temporary password.
          </p>

          {createError && <p className="text-red-600 mb-4">{createError}</p>}

          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Full name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Dr. Jane Doe"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane.doe@clinic.example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Temporary password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Set a temporary password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Specialty
              </label>
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
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Phone (optional)
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(555) 000-0000"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            onClick={handleCreateProvider}
            disabled={creating}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Provider Account"}
          </button>
        </div>
      )}
    </div>
  );
}