"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

interface PatientRow {
  id: number;
  name: string;
  initials: string;
  patientId: string;
  dob: string;
  lastVisit: string;
}

const allPatients: PatientRow[] = [
  { id: 1, name: "Eleanor Marsh", initials: "EM", patientId: "PT-049213", dob: "Aug 14, 1951", lastVisit: "Jun 18, 2026" },
  { id: 2, name: "Robert Tan", initials: "RT", patientId: "PT-051877", dob: "Mar 2, 1968", lastVisit: "Jun 18, 2026" },
  { id: 3, name: "Grace Park", initials: "GP", patientId: "PT-048120", dob: "Nov 30, 1979", lastVisit: "Jun 18, 2026" },
  { id: 4, name: "David Huang", initials: "DH", patientId: "PT-052390", dob: "Jul 21, 1990", lastVisit: "May 12, 2026" },
  { id: 5, name: "Sofia Ortega", initials: "SO", patientId: "PT-050664", dob: "Jan 9, 1985", lastVisit: "May 28, 2026" },
  { id: 6, name: "Marcus Lee", initials: "ML", patientId: "PT-047205", dob: "Sep 17, 1943", lastVisit: "Apr 30, 2026" },
  { id: 7, name: "Karen Adams", initials: "KA", patientId: "PT-053001", dob: "Feb 25, 1972", lastVisit: "Jun 2, 2026" },
  { id: 8, name: "James Wood", initials: "JW", patientId: "PT-046788", dob: "Dec 5, 1958", lastVisit: "Jun 9, 2026" },
  { id: 9, name: "Nina Petrova", initials: "NP", patientId: "PT-051002", dob: "Jun 11, 1995", lastVisit: "Jun 4, 2026" },
  { id: 10, name: "Omar Haddad", initials: "OH", patientId: "PT-049980", dob: "Apr 19, 1963", lastVisit: "Jun 1, 2026" },
  { id: 11, name: "Lucy Chen", initials: "LC", patientId: "PT-052771", dob: "Oct 28, 1988", lastVisit: "May 27, 2026" },
  { id: 12, name: "Paul Rivera", initials: "PR", patientId: "PT-048533", dob: "May 3, 1976", lastVisit: "May 22, 2026" },
  { id: 13, name: "Hannah Brooks", initials: "HB", patientId: "PT-053422", dob: "Aug 30, 1939", lastVisit: "Mar 15, 2026" },
  { id: 14, name: "Tomás Vega", initials: "TV", patientId: "PT-050118", dob: "Feb 14, 1982", lastVisit: "Apr 8, 2026" },
];

const PAGE_SIZE = 8;

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // backend connect hone par yeh GET /api/provider/patients?search= ban jayega
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return allPatients;
    return allPatients.filter((p) => p.name.toLowerCase().includes(query));
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // search change pe page 1 pe reset karna zaroori hai
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Patients</h1>
      <p className="text-muted mt-1 mb-5">{filtered.length} patients</p>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search patients..."
          className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-muted uppercase border-b border-gray-200">
              <th className="px-5 py-3 font-semibold">Patient</th>
              <th className="px-5 py-3 font-semibold">Date of Birth</th>
              <th className="px-5 py-3 font-semibold">Last Visit</th>
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
                        {p.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{p.name}</p>
                        <p className="text-xs text-muted">ID · {p.patientId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-foreground">{p.dob}</td>
                  <td className="px-5 py-4 text-foreground">{p.lastVisit}</td>
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

      {/* Pagination */}
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
    </div>
  );
}