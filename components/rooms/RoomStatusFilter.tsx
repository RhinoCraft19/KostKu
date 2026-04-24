"use client";

import { Button } from "@/components/ui/button";
import { RoomStatus } from "@/types";

interface RoomStatusFilterProps {
  activeStatus: RoomStatus | "ALL";
  onStatusChange: (status: RoomStatus | "ALL") => void;
}

export function RoomStatusFilter({ activeStatus, onStatusChange }: RoomStatusFilterProps) {
  const statuses: { label: string; value: RoomStatus | "ALL" }[] = [
    { label: "SEMUA", value: "ALL" },
    { label: "KOSONG", value: "VACANT" },
    { label: "TERISI", value: "OCCUPIED" },
    { label: "MAINTENANCE", value: "MAINTENANCE" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((s) => (
        <Button
          key={s.value}
          variant={activeStatus === s.value ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange(s.value)}
          className="rounded-full px-4"
        >
          {s.label}
        </Button>
      ))}
    </div>
  );
}
