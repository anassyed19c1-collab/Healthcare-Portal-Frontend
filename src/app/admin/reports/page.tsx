"use client";

import { useState } from "react";

type Tab = "Appointments" | "Patients" | "Providers" | "Revenue";

interface StatCard {
  label: string;
  value: string;
  sub: string;
  positive: boolean;
}

interface ChartBar {
  label: string;
  value: number;
}

interface TableColumn {
  key: string;
  label: string;
}

interface ReportTab {
  subtitle: string;
  stats: StatCard[];
  chartTitle: string;
  chartNote: string;
  chartData: ChartBar[];
  tableColumns: TableColumn[];
  tableRows: Record<string, string | number>[];
}

const reportData: Record<Tab, ReportTab> = {
  Appointments: {
    subtitle: "Appointments report",
    stats: [
      { label: "Total Appointments", value: "1,284", sub: "+8.2% vs prior period", positive: true },
      { label: "Completed", value: "1,041", sub: "81% completion rate", positive: true },
      { label: "Cancelled", value: "168", sub: "13% of total", positive: false },
      { label: "No-shows", value: "75", sub: "6% of total", positive: false },
    ],
    chartTitle: "Appointments per week",
    chartNote: "Last 6 weeks",
    chartData: [
      { label: "Wk 1", value: 196 }, { label: "Wk 2", value: 224 }, { label: "Wk 3", value: 208 },
      { label: "Wk 4", value: 241 }, { label: "Wk 5", value: 198 }, { label: "Wk 6", value: 217 },
    ],
    tableColumns: [
      { key: "specialty", label: "Specialty" }, { key: "booked", label: "Booked" },
      { key: "completed", label: "Completed" }, { key: "cancelled", label: "Cancelled" },
      { key: "noShowRate", label: "No-show Rate" },
    ],
    tableRows: [
      { specialty: "Cardiology", booked: 312, completed: 268, cancelled: 31, noShowRate: "4.2%" },
      { specialty: "Dermatology", booked: 248, completed: 205, cancelled: 29, noShowRate: "5.6%" },
      { specialty: "Primary Care", booked: 421, completed: 352, cancelled: 44, noShowRate: "5.9%" },
      { specialty: "Orthopedics", booked: 186, completed: 142, cancelled: 33, noShowRate: "6.4%" },
      { specialty: "Endocrinology", booked: 117, completed: 94, cancelled: 16, noShowRate: "5.9%" },
    ],
  },
  Patients: {
    subtitle: "Patients report",
    stats: [
      { label: "Total Patients", value: "2,481", sub: "+34 this period", positive: true },
      { label: "New Patients", value: "147", sub: "+12% vs prior period", positive: true },
      { label: "Active Patients", value: "1,938", sub: "78% of total", positive: false },
      { label: "Inactive", value: "543", sub: "22% of total", positive: false },
    ],
    chartTitle: "New patient signups per week",
    chartNote: "Last 6 weeks",
    chartData: [
      { label: "Wk 1", value: 21 }, { label: "Wk 2", value: 28 }, { label: "Wk 3", value: 24 },
      { label: "Wk 4", value: 31 }, { label: "Wk 5", value: 19 }, { label: "Wk 6", value: 24 },
    ],
    tableColumns: [
      { key: "ageGroup", label: "Age Group" }, { key: "patients", label: "Patients" },
      { key: "active", label: "Active" }, { key: "share", label: "Share" },
    ],
    tableRows: [
      { ageGroup: "18–34", patients: 486, active: 402, share: "20%" },
      { ageGroup: "35–49", patients: 612, active: 511, share: "25%" },
      { ageGroup: "50–64", patients: 705, active: 548, share: "28%" },
      { ageGroup: "65–79", patients: 451, active: 337, share: "18%" },
      { ageGroup: "80+", patients: 227, active: 140, share: "9%" },
    ],
  },
  Providers: {
    subtitle: "Providers report",
    stats: [
      { label: "Total Providers", value: "57", sub: "+3 this period", positive: true },
      { label: "Active", value: "52", sub: "91% of roster", positive: false },
      { label: "Avg. Utilization", value: "84%", sub: "+2.1 pts vs prior", positive: true },
      { label: "Avg. Rating", value: "4.7", sub: "Out of 5.0", positive: false },
    ],
    chartTitle: "Appointments by specialty",
    chartNote: "This period",
    chartData: [
      { label: "Cardio", value: 312 }, { label: "Derm", value: 248 }, { label: "Primary", value: 421 },
      { label: "Ortho", value: 186 }, { label: "Endo", value: 117 }, { label: "Other", value: 156 },
    ],
    tableColumns: [
      { key: "provider", label: "Provider" }, { key: "specialty", label: "Specialty" },
      { key: "appts", label: "Appts" }, { key: "utilization", label: "Utilization" },
      { key: "rating", label: "Rating" },
    ],
    tableRows: [
      { provider: "Dr. Anita Rao", specialty: "Cardiology", appts: 186, utilization: "92%", rating: 4.9 },
      { provider: "Dr. James Okoro", specialty: "Dermatology", appts: 154, utilization: "86%", rating: 4.7 },
      { provider: "Dr. Lena Schmidt", specialty: "Primary Care", appts: 211, utilization: "95%", rating: 4.8 },
      { provider: "Dr. Marcus Bell", specialty: "Orthopedics", appts: 132, utilization: "79%", rating: 4.5 },
      { provider: "Dr. Priya Nair", specialty: "Endocrinology", appts: 108, utilization: "81%", rating: 4.6 },
    ],
  },
  Revenue: {
    subtitle: "Revenue report",
    stats: [
      { label: "Total Revenue", value: "$486K", sub: "+9.4% vs prior period", positive: true },
      { label: "Collected", value: "$432K", sub: "89% collection rate", positive: true },
      { label: "Outstanding", value: "$54K", sub: "11% of billed", positive: false },
      { label: "Avg. per Visit", value: "$378", sub: "+$14 vs prior", positive: true },
    ],
    chartTitle: "Revenue per week",
    chartNote: "Thousands (USD), last 6 weeks",
    chartData: [
      { label: "Wk 1", value: 74 }, { label: "Wk 2", value: 82 }, { label: "Wk 3", value: 79 },
      { label: "Wk 4", value: 88 }, { label: "Wk 5", value: 76 }, { label: "Wk 6", value: 87 },
    ],
    tableColumns: [
      { key: "specialty", label: "Specialty" }, { key: "billed", label: "Billed" },
      { key: "collected", label: "Collected" }, { key: "outstanding", label: "Outstanding" },
    ],
    tableRows: [
      { specialty: "Cardiology", billed: "$142K", collected: "$129K", outstanding: "$13K" },
      { specialty: "Dermatology", billed: "$88K", collected: "$80K", outstanding: "$8K" },
      { specialty: "Primary Care", billed: "$121K", collected: "$112K", outstanding: "$9K" },
      { specialty: "Orthopedics", billed: "$84K", collected: "$71K", outstanding: "$13K" },
      { specialty: "Endocrinology", billed: "$51K", collected: "$40K", outstanding: "$11K" },
    ],
  },
};

const tabs: Tab[] = ["Appointments", "Patients", "Providers", "Revenue"];

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Appointments");
  const [fromDate, setFromDate] = useState("2026-05-18");
  const [toDate, setToDate] = useState("2026-06-18");

  const data = reportData[activeTab];
  const maxValue = Math.max(...data.chartData.map((d) => d.value));

  const handleApply = () => {
    // backend connect hone par: GET /api/admin/reports?from=&to=&type=
    console.log("Applying date range:", activeTab, fromDate, toDate);
  };

  const handleExport = (format: "pdf" | "csv") => {
    // backend connect hone par: GET /api/admin/reports/export?format=
    console.log("Exporting", activeTab, "as", format);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted mt-1">
            {data.subtitle} · May 18, 2026 – Jun 18, 2026
          </p>
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
            className={`pb-3 text-sm font-semibold border-b-2 -mb-px ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Date filter */}
      <div className="flex gap-4 items-end mb-8">
        <div>
          <label className="block text-sm text-muted mb-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={handleApply}
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-lg"
        >
          Apply
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {data.stats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl shadow-sm p-5">
            <p className="text-sm text-muted mb-3">{s.label}</p>
            <p className="text-3xl font-bold text-foreground mb-1">{s.value}</p>
            <p className={`text-sm ${s.positive ? "text-green-600" : "text-muted"}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-card rounded-2xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-bold text-foreground">{data.chartTitle}</h2>
          <span className="text-sm text-muted">{data.chartNote}</span>
        </div>
        <div className="flex items-end justify-between gap-4 h-56">
          {data.chartData.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
              <span className="font-bold text-foreground">{d.value}</span>
              <div
                className="w-full max-w-[60px] bg-primary rounded-t-lg"
                style={{ height: `${(d.value / maxValue) * 180}px` }}
              />
              <span className="text-sm text-muted">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown table */}
      <div className="bg-card rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="text-xs text-muted uppercase border-b border-gray-200 bg-background">
              {data.tableColumns.map((col) => (
                <th key={col.key} className="px-5 py-3 font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.tableRows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                {data.tableColumns.map((col, j) => (
                  <td
                    key={col.key}
                    className={`px-5 py-4 ${j === 0 ? "font-semibold text-foreground" : "text-foreground"}`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}