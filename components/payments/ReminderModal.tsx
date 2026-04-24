"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Payment } from "@/types";
import { generateWAReminder } from "@/lib/utils/reminder-template";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
  propertyName: string;
}

export function ReminderModal({ isOpen, onClose, payment, propertyName }: ReminderModalProps) {
  const text = generateWAReminder({
    tenantName: payment.tenantName,
    roomNumber: payment.roomNumber,
    amount: payment.amount,
    dueDate: payment.dueDate,
    propertyName,
    paymentLink: payment.midtransPaymentUrl,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Teks reminder berhasil disalin!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview Reminder WhatsApp</DialogTitle>
        </DialogHeader>
        <pre className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap font-sans">
          {text}
        </pre>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={handleCopy}>📋 Salin Teks</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
