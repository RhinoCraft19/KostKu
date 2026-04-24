"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMarkPaid } from "@/hooks/usePayments";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/shared/ImageUploader";

export const markPaidSchema = z.object({
  paidDate: z.string().min(1, "Tanggal bayar wajib diisi"),
  paymentProofUrl: z.string().optional(),
});

export type MarkPaidFormData = z.infer<typeof markPaidSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string;
}

export function MarkPaidModal({ isOpen, onClose, paymentId }: Props) {
  const { mutate: markPaid, isPending } = useMarkPaid();

  const form = useForm<MarkPaidFormData>({
    resolver: zodResolver(markPaidSchema),
    defaultValues: {
      paidDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (data: MarkPaidFormData) => {
    markPaid({ paymentId, ...data }, { onSuccess: onClose });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tandai Pembayaran Lunas</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="paidDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Bayar</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <label className="text-sm font-medium mb-2 block">
                Bukti Transfer (opsional)
              </label>
              <ImageUploader
                onChange={(url: string) => form.setValue("paymentProofUrl", url)}
                bucket="kostos-assets"
                folder="payment-proofs"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "✅ Tandai Lunas"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
