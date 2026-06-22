"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { getToken } from "@/lib/auth";

type Tab = "Appointments" | "Patients" | "Providers" | "Revenue";
const tabs: Tab[] = ["Appointments", "Patients", "Providers", "Revenue"];

interface StatusCount {
  status: string;
  _count: number;
}

interface ReportStats {
  totalPatients: number;
  totalProviders: number;
  totalAppointments: number;
  todayAppointments: number;
  appointmentsByStatus: StatusCount[];
}

interface ReportsResponse {
  stats: ReportStats;
}

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Appointments");
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiFetch<ReportsResponse>("/admin/reports", { token })
      .then((data) => {
        setStats(data.stats);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load reports:", err);
        setError("Could not load reports.");
        setLoading(false);
      });
  }, []);

  const getCount = (status: string) =>
    stats?.appointmentsByStatus.find((s) => s.status === status)?._count ?? 0;

  const confirmedCount = getCount("CONFIRMED");
  const completedCount = getCount("COMPLETED");
  const cancelledCount = getCount("CANCELLED");
  const pendingCount = getCount("PENDING");

  const completionRate = stats?.totalAppointments
    ? Math.round((completedCount / stats.totalAppointments) * 100)
    : 0;

  const cancellationRate = stats?.totalAppointments
    ? Math.round((cancelledCount / stats.totalAppointments) * 100)
    : 0;

  // Chart max value (for bar height)
  const chartData = [
    { label: "Confirmed", value: confirmedCount },
    { label: "Completed", value: completedCount },
    { label: "Cancelled", value: cancelledCount },
    { label: "Pending", value: pendingCount },
  ];
  const maxValue = Math.max(...chartData.map((d) => d.value), 1);


  const handleExport = async (format: "pdf" | "csv") => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/reports/export?format=${format}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Could not export report. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted mt-1">Portal activity overview</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleExport("pdf")}
            className="border border-gray-300 text-foreground font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="border border-gray-300 text-foreground font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold border-b-2 -mb-px ${activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-muted">Loading reports...</p>
      ) : activeTab !== "Appointments" ? (
        <div className="bg-card rounded-2xl shadow-sm p-12 text-center text-muted">
          {activeTab} report — coming soon.
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: "Total Appointments", value: stats?.totalAppointments ?? 0, sub: `${completedCount} completed` },
              { label: "Completed", value: completedCount, sub: `${completionRate}% completion rate`, positive: true },
              { label: "Cancelled", value: cancelledCount, sub: `${cancellationRate}% of total` },
              { label: "Pending", value: pendingCount, sub: "Awaiting provider review" },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-2xl shadow-sm p-5">
                <p className="text-sm text-muted mb-3">{s.label}</p>
                <p className="text-3xl font-bold text-foreground mb-1">{s.value}</p>
                <p className={`text-sm ${s.positive ? "text-green-600" : "text-muted"}`}>
                  {s.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="bg-card rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-bold text-foreground">Appointments by Status</h2>
              <span className="text-sm text-muted">Current data</span>
            </div>
            <div className="flex items-end justify-around gap-4 h-48">
              {chartData.map((d) => (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                  <span className="font-bold text-foreground">{d.value}</span>
                  <div
                    className="w-full max-w-[80px] bg-primary rounded-t-lg"
                    style={{ height: `${(d.value / maxValue) * 160}px` }}
                  />
                  <span className="text-sm text-muted text-center">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown table */}
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-muted uppercase border-b border-gray-200 bg-background">
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Count</th>
                  <th className="px-5 py-3 font-semibold">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row) => (
                  <tr key={row.label} className="border-b border-gray-100 last:border-0">
                    <td className="px-5 py-4 font-semibold text-foreground">{row.label}</td>
                    <td className="px-5 py-4 text-foreground">{row.value}</td>
                    <td className="px-5 py-4 text-foreground">
                      {stats?.totalAppointments
                        ? Math.round((row.value / stats.totalAppointments) * 100)
                        : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}