import StatusBadge from "./StatusBadge";

type Status = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

interface AppointmentCardProps {
  providerName: string;
  specialization: string;
  status: Status;
  date: string;
  time: string;
  location: string;
  onReschedule?: () => void;
  onCancel?: () => void;
}

export default function AppointmentCard({
  providerName,
  specialization,
  status,
  date,
  time,
  location,
  onReschedule,
  onCancel,
}: AppointmentCardProps) {
  const initials = providerName
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showActions = status === "PENDING" || status === "CONFIRMED";

  return (
    <div className="bg-card rounded-2xl shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-foreground">{providerName}</p>
            <p className="text-sm text-muted">{specialization}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="bg-background rounded-lg px-4 py-3">
        <p className="font-medium text-foreground text-sm">{date}</p>
        <p className="text-sm text-muted">
          {time} · {location}
        </p>
      </div>

      {showActions && (
        <div className="flex gap-4 text-sm font-semibold">
          <button onClick={onReschedule} className="text-primary hover:underline">
            Reschedule
          </button>
          <button onClick={onCancel} className="text-red-600 hover:underline">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}