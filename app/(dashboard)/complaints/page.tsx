import { PageHeader } from "@/components/shared/PageHeader";
import { TicketList } from "@/components/complaints/TicketList";
import { CopyLinkButton } from "@/components/complaints/CopyLinkButton";

export default function ComplaintsPage() {
  return (
    <div>
      <PageHeader
        title="Keluhan Tenant"
        description="Kelola dan pantau status keluhan yang masuk."
        action={<CopyLinkButton />} // Tombol "Salin Link"
      />
      <TicketList />
    </div>
  );
}
