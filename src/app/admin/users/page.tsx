"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

type Role = "Patient" | "Provider" | "Admin";
type Status = "Active" | "Inactive";

interface UserRow {
    id: number;
    name: string;
    initials: string;
    role: Role;
    email: string;
    status: Status;
}

const allUsers: UserRow[] = [
    { id: 1, name: "Eleanor Marsh", initials: "EM", role: "Patient", email: "eleanor.marsh@example.com", status: "Active" },
    { id: 2, name: "Dr. Anita Rao", initials: "AR", role: "Provider", email: "anita.rao@clinic.example.com", status: "Active" },
    { id: 3, name: "Robert Tan", initials: "RT", role: "Patient", email: "robert.tan@example.com", status: "Active" },
    { id: 4, name: "Carla Tran", initials: "CT", role: "Admin", email: "carla.tran@clinic.example.com", status: "Active" },
    { id: 5, name: "Dr. James Okoro", initials: "JO", role: "Provider", email: "james.okoro@clinic.example.com", status: "Active" },
    { id: 6, name: "Grace Park", initials: "GP", role: "Patient", email: "grace.park@example.com", status: "Inactive" },
    { id: 7, name: "David Huang", initials: "DH", role: "Patient", email: "david.huang@example.com", status: "Active" },
    { id: 8, name: "Dr. Lena Schmidt", initials: "LS", role: "Provider", email: "lena.schmidt@clinic.example.com", status: "Active" },
    { id: 9, name: "Sofia Ortega", initials: "SO", role: "Patient", email: "sofia.ortega@example.com", status: "Active" },
    { id: 10, name: "Marcus Lee", initials: "ML", role: "Patient", email: "marcus.lee@example.com", status: "Inactive" },
    { id: 11, name: "Dr. Priya Nair", initials: "PN", role: "Provider", email: "priya.nair@clinic.example.com", status: "Active" },
    { id: 12, name: "Karen Adams", initials: "KA", role: "Patient", email: "karen.adams@example.com", status: "Active" },
    { id: 13, name: "Devin Reyes", initials: "DR", role: "Admin", email: "devin.reyes@clinic.example.com", status: "Inactive" },
    { id: 14, name: "Nina Petrova", initials: "NP", role: "Patient", email: "nina.petrova@example.com", status: "Active" },
    { id: 15, name: "Dr. Marcus Bell", initials: "MB", role: "Provider", email: "marcus.bell@clinic.example.com", status: "Active" },
    { id: 16, name: "Omar Haddad", initials: "OH", role: "Patient", email: "omar.haddad@example.com", status: "Active" },
];

const roleStyles: Record<Role, string> = {
    Patient: "bg-violet-100 text-violet-700",
    Provider: "bg-sky-100 text-sky-700",
    Admin: "bg-amber-100 text-amber-800",
};

const PAGE_SIZE = 8;

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("All roles");
    const [status, setStatus] = useState("All");
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState(allUsers);

    const filtered = useMemo(() => {
        return users.filter((u) => {
            const query = search.trim().toLowerCase();
            const matchesSearch =
                !query ||
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query);
            const matchesRole = role === "All roles" || u.role === role;
            const matchesStatus = status === "All" || u.status === status;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, search, role, status]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    const resetPage = () => setPage(1);

    const toggleStatus = (id: number) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u
            )
        );
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-foreground">Users</h1>
            <p className="text-muted mt-1 mb-5">{filtered.length} users</p>

            {/* Filters */}
            <div className="flex gap-4 mb-6 items-end flex-wrap">
                <div className="flex-1 min-w-[260px]">
                    <label className="block text-sm text-muted mb-1">Search</label>
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                resetPage();
                            }}
                            placeholder="Search by name or email..."
                            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-muted mb-1">Role</label>
                    <select
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                            resetPage();
                        }}
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
                        onChange={(e) => {
                            setStatus(e.target.value);
                            resetPage();
                        }}
                        className="border border-gray-300 rounded-lg px-4 py-2.5 text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option>All</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
            </div>

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
                                                {u.initials}
                                            </div>
                                            <span className="font-semibold text-foreground whitespace-nowrap">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${roleStyles[u.role]}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-foreground whitespace-nowrap">{u.email}</td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${u.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-600"
                                                }`}
                                        >
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                                            <button className="text-primary font-semibold text-sm hover:underline w-10 text-left">
                                                Edit
                                            </button>
                                            {u.status === "Active" ? (
                                                <button
                                                    onClick={() => toggleStatus(u.id)}
                                                    className="border border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm px-4 py-1.5 rounded-lg whitespace-nowrap w-28 text-center"
                                                >
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => toggleStatus(u.id)}
                                                    className="border border-green-300 text-green-700 hover:bg-green-50 font-semibold text-sm px-4 py-1.5 rounded-lg whitespace-nowrap w-28 text-center"
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
                                className={`w-9 h-9 rounded-lg text-sm font-semibold ${p === page ? "bg-primary text-white" : "border border-gray-300 text-foreground hover:bg-gray-50"
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