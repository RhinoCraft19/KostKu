import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = 
  | "VACANT" 
  | "OCCUPIED" 
  | "MAINTENANCE" 
  | "PAID" 
  | "UNPAID" 
  | "PARTIAL" 
  | "OPEN" 
  | "IN_PROGRESS" 
  | "RESOLVED";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<StatusType, { label: string; className: string }> = {
    VACANT: { 
      label: "Tersedia", 
      className: "bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-blue-200" 
    },
    OCCUPIED: { 
      label: "Terisi", 
      className: "bg-success/15 text-success hover:bg-success/20 border-success/20" 
    },
    MAINTENANCE: { 
      label: "Perbaikan", 
      className: "bg-warning/15 text-warning hover:bg-warning/20 border-warning/20" 
    },
    PAID: { 
      label: "Lunas", 
      className: "bg-success/15 text-success hover:bg-success/20 border-success/20" 
    },
    UNPAID: { 
      label: "Belum Bayar", 
      className: "bg-danger/15 text-danger hover:bg-danger/20 border-danger/20" 
    },
    PARTIAL: { 
      label: "Cicilan", 
      className: "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200" 
    },
    OPEN: { 
      label: "Baru", 
      className: "bg-danger/15 text-danger hover:bg-danger/20 border-danger/20" 
    },
    IN_PROGRESS: { 
      label: "Diproses", 
      className: "bg-primary/15 text-primary hover:bg-primary/20 border-primary/20" 
    },
    RESOLVED: { 
      label: "Selesai", 
      className: "bg-success/15 text-success hover:bg-success/20 border-success/20" 
    },
  };

  const config = statusConfig[status];

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium px-2.5 py-0.5 rounded-full", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
