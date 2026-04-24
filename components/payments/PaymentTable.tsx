"use client";

import { useState } from "react";
import { usePayments, useCreatePaymentLink } from "@/hooks/usePayments";
import { useAppStore } from "@/store/useAppStore";
import { formatIDR, formatDateID } from "@/lib/utils/format";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { CreditCard, MoreHorizontal, MessageCircle, Link as LinkIcon, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Payment } from "@/types";
import { ReminderModal } from "./ReminderModal";
import { MarkPaidModal } from "./MarkPaidModal";

export function PaymentTable() {
  const { paymentFilter, activePropertyId } = useAppStore();
  const { data: payments = [], isLoading } = usePayments(activePropertyId, paymentFilter);
  const { mutate: createLink } = useCreatePaymentLink();

  const [reminderPayment, setReminderPayment] = useState<Payment | null>(null);
  const [markPaidPayment, setMarkPaidPayment] = useState<Payment | null>(null);

  if (isLoading) return <LoadingSkeleton />;

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="Belum ada tagihan"
        description="Belum ada data pembayaran untuk bulan dan filter yang dipilih."
      />
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <table role="grid" aria-label="Tabel Pembayaran" className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground uppercase text-xs">
          <tr>
            <th scope="col" className="px-4 py-3">Kamar</th>
            <th scope="col" className="px-4 py-3">Tenant</th>
            <th scope="col" className="px-4 py-3">Nominal</th>
            <th scope="col" className="px-4 py-3">Jatuh Tempo</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {payments.map((payment) => (
            <tr key={payment.id} className="bg-card hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 font-medium">{payment.roomNumber}</td>
              <td className="px-4 py-3">{payment.tenantName}</td>
              <td className="px-4 py-3">{formatIDR(payment.amount)}</td>
              <td className="px-4 py-3">{formatDateID(payment.dueDate)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={payment.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" }) + " h-8 w-8 p-0"}>
                    <span className="sr-only">Buka menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setReminderPayment(payment)}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Salin Reminder WA
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => createLink(payment.id)}>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Buat Link Bayar
                    </DropdownMenuItem>
                    {payment.status !== "PAID" && (
                      <DropdownMenuItem onClick={() => setMarkPaidPayment(payment)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Tandai Lunas
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reminderPayment && (
        <ReminderModal
          isOpen={!!reminderPayment}
          onClose={() => setReminderPayment(null)}
          payment={reminderPayment}
          propertyName="KostOS Property" // Placeholder
        />
      )}

      {markPaidPayment && (
        <MarkPaidModal
          isOpen={!!markPaidPayment}
          onClose={() => setMarkPaidPayment(null)}
          paymentId={markPaidPayment.id}
        />
      )}
    </div>
  );
}
