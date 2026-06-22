"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
}

interface PatientsResponse {
  patients: Patient[];
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDOB(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const PAGE_SIZE = 8;

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiFetch<PatientsResponse>("/provider/patients", { token })
      .then((data) => {
        setPatients(data.patients || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load patients:", err);
        setError("Could not load patients.");
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return patients;
    return patients.filter((p) => p.name.toLowerCase().includes(query));
  }, [patients, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Patients</h1>
      <p className="text-muted mt-1 mb-5">{filtered.length} patients</p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search patients..."
          className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {loading ? (
        <p className="text-muted">Loading patients...</p>
      ) : (
        <>
          <div className="bg-card rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="text-xs text-muted uppercase border-b border-gray-200">
                  <th className="px-5 py-3 font-semibold">Patient</th>
                  <th className="px-5 py-3 font-semibold">Date of Birth</th>
                  <th className="px-5 py-3 font-semibold">Phone</th>
                  <th className="px-5 py-3 font-semibold text-right">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-muted">
                      No patients found.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                            {getInitials(p.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{p.name}</p>
                            <p className="text-xs text-muted">{p.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-foreground">{formatDOB(p.dateOfBirth)}</td>
                      <td className="px-5 py-4 text-foreground">{p.phone || "—"}</td>
                      <td className="px-5 py-4 text-right">
                        <button className="bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-4 py-2 rounded-lg">
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted">
                Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-foreground disabled:opacity-50 hover:bg-gray-50"
                >
                  ‹ Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold ${
                      p === page ? "bg-primary text-white" : "border border-gray-300 text-foreground hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-foreground disabled:opacity-50 hover:bg-gray-50"
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}