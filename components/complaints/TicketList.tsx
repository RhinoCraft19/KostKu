"use client";
import { useState, useEffect } from "react";
import { useComplaints } from "@/hooks/useComplaints";
import { useAppStore } from "@/store/useAppStore";
import { ComplaintStatus, Complaint } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { formatDateID } from "@/lib/utils/format";
import { TicketDetailDrawer } from "./TicketDetailDrawer";
import { MessageSquare } from "lucide-react";

type FilterOption = ComplaintStatus | "ALL";
const filterOptions: FilterOption[] = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"];

export function TicketList() {
  const { activePropertyId, setOpenComplaintsCount } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<FilterOption>("ALL");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const { data: complaints, isLoading } = useComplaints(
    activePropertyId ?? "",
    { status: activeFilter }
  );

  useEffect(() => {
    if (complaints) {
      const openCount = complaints.filter((c) => c.status === "OPEN").length;
      setOpenComplaintsCount(openCount);
    }
  }, [complaints, setOpenComplaintsCount]);

  if (isLoading) return <LoadingSkeleton />;
  if (!complaints || complaints.length === 0) {
    return <EmptyState icon={MessageSquare} title="Belum ada keluhan" description="Belum ada keluhan yang masuk." />;
  }

  return (
    <div>
      {/* Tab Filter Status */}
      <div className="flex gap-2 mb-4">
        {filterOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setActiveFilter(opt)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors
              ${activeFilter === opt ? "bg-primary text-white" : "bg-white text-gray-600"}`}
          >
            {opt === "ALL" ? "Semua" : opt.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Daftar Keluhan */}
      <div className="space-y-3">
        {complaints.map((complaint) => (
          <div
            key={complaint.id}
            onClick={() => setSelectedComplaint(complaint)}
            className="p-4 bg-white border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{complaint.tenantName} — Kamar {complaint.roomNumber}</p>
                <p className="text-sm text-gray-500 mt-1">{complaint.description.substring(0, 80)}...</p>
                <p className="text-xs text-gray-400 mt-2">{formatDateID(complaint.createdAt)}</p>
              </div>
              <StatusBadge status={complaint.status} />
            </div>
          </div>
        ))}
      </div>

      {/* Drawer detail — muncul saat salah satu tiket diklik */}
      {selectedComplaint && (
        <TicketDetailDrawer
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
}
