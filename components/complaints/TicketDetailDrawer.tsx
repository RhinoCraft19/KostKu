"use client";
import { Complaint, ComplaintStatus } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useUpdateComplaintStatus } from "@/hooks/useComplaints";
import { formatDateID } from "@/lib/utils/format";

interface Props {
  complaint: Complaint;
  onClose: () => void;
}

const statusOptions: ComplaintStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED"];

export function TicketDetailDrawer({ complaint, onClose }: Props) {
  const { mutate: updateStatus, isPending } = useUpdateComplaintStatus();

  const handleStatusChange = (newStatus: string) => {
    updateStatus({ id: complaint.id, status: newStatus });
  };

  return (
    // open={true} karena komponen ini hanya dirender saat complaint dipilih
    <Sheet open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detail Keluhan</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-3 text-sm">
          <p><span className="font-medium">Nama:</span> {complaint.tenantName}</p>
          <p><span className="font-medium">Kamar:</span> {complaint.roomNumber}</p>
          <p><span className="font-medium">Kategori:</span> {complaint.category}</p>
          <p><span className="font-medium">Tanggal:</span> {formatDateID(complaint.createdAt)}</p>
          <p><span className="font-medium">Deskripsi:</span> {complaint.description}</p>

          {complaint.photoUrl && (
            <div>
              <p className="font-medium mb-1">Foto:</p>
              <img src={complaint.photoUrl} alt="Foto keluhan" className="rounded-md max-h-48 object-cover" />
            </div>
          )}

          <div className="pt-2">
            <p className="font-medium mb-2">Ubah Status:</p>
            <div className="flex items-center gap-3">
              <select
                defaultValue={complaint.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isPending}
                className="input flex-1"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
              <StatusBadge status={complaint.status} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
