"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";

type Role = "PATIENT" | "PROVIDER" | "ADMIN";

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  phone: string | null;
  specialization: string | null;
}

interface UsersResponse {
  users: UserRow[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const roleStyles: Record<Role, string> = {
  PATIENT: "bg-violet-100 text-violet-700",
  PROVIDER: "bg-sky-100 text-sky-700",
  ADMIN: "bg-amber-100 text-amber-800",
};

const roleLabels: Record<Role, string> = {
  PATIENT: "Patient",
  PROVIDER: "Provider",
  ADMIN: "Admin",
};

const PAGE_SIZE = 8;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All roles");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiFetch<UsersResponse>("/admin/users", { token })
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load users:", err);
        setError("Could not load users.");
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query);
      const matchesRole =
        role === "All roles" || u.role === role.toUpperCase();
      const matchesStatus =
        status === "All" ||
        (status === "Active" && u.isActive) ||
        (status === "Inactive" && !u.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const resetPage = () => setPage(1);

  const toggleStatus = async (id: number, currentlyActive: boolean) => {
    setActionError("");
    const token = getToken();
    try {
      await apiFetch(`/admin/users/${id}/deactivate`, {
        method: "PUT",
        token: token || undefined,
      });
      setUsers((prev) =>
        prev.map((u) => u.id === id ? { ...u, isActive: !currentlyActive } : u)
      );
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message);
      } else {
        setActionError("Action failed. Please try again.");
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Users</h1>
      <p className="text-muted mt-1 mb-5">{filtered.length} users</p>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {actionError && <p className="text-red-600 mb-4">{actionError}</p>}

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-end flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <label className="block text-sm text-muted mb-1">Search</label>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => { setRole(e.target.value); resetPage(); }}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All roles</option>
            <option>Patient</option>
            <option>Provider</option>
            <option>Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); resetPage(); }}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading users...</p>
      ) : (
        <>
          {/* Table */}
          <div className="bg-card rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="text-xs text-muted uppercase border-b border-gray-200 bg-background">
                  <th className="px-5 py-3 font-semibold w-[28%]">Name</th>
                  <th className="px-5 py-3 font-semibold w-[14%]">Role</th>
                  <th className="px-5 py-3 font-semibold w-[30%]">Email</th>
                  <th className="px-5 py-3 font-semibold w-[12%]">Status</th>
                  <th className="px-5 py-3 font-semibold w-[16%] text-right">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((u) => (
                    <tr key={u.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                            {getInitials(u.name)}
                          </div>
                          <span className="font-semibold text-foreground whitespace-nowrap">
                            {u.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleStyles[u.role]}`}>
                          {roleLabels[u.role]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-foreground whitespace-nowrap">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button className="text-primary font-semibold text-sm hover:underline w-10 text-left">
                            Edit
                          </button>
                          {u.isActive ? (
                            <button
                              onClick={() => toggleStatus(u.id, true)}
                              className="border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm px-4 py-1.5 rounded-lg w-28 text-center"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleStatus(u.id, false)}
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
        </>
      )}
    </div>
  );
}