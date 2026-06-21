type Status = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "UPCOMING";

const statusStyles: Record<Status, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-pink-100 text-rose-700",
  UPCOMING: "bg-pink-100 text-rose-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-200 text-gray-600",
};

const statusLabels: Record<Status, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  UPCOMING: "Upcoming",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}