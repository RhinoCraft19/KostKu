import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Payment, MarkPaidInput, PaymentFilter } from "@/types";

export const usePayments = (propertyId: string | null, filter: PaymentFilter) => {
  return useQuery({
    queryKey: ["payments", propertyId, filter.month, filter.year, filter.status],
    queryFn: async () => {
      if (!propertyId) return [];
      const res = await fetch(
        `/api/payments?propertyId=${propertyId}&month=${filter.month}&year=${filter.year}&status=${filter.status ?? "ALL"}`
      );
      if (!res.ok) throw new Error("Failed to fetch payments");
      return res.json() as Promise<Payment[]>;
    },
    enabled: !!propertyId,
  });
};

export const useMarkPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MarkPaidInput) => {
      const res = await fetch(`/api/payments/${data.paymentId}/mark-paid`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to mark as paid");
      return res.json();
    },

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["payments"] });

      const previousPayments = queryClient.getQueriesData({ queryKey: ["payments"] });

      queryClient.setQueriesData(
        { queryKey: ["payments"] },
        (old: Payment[] | undefined) =>
          old?.map((p) =>
            p.id === newData.paymentId
              ? { ...p, status: "PAID" as const, paidDate: newData.paidDate }
              : p
          ) ?? []
      );

      return { previousPayments };
    },

    onError: (_err, _newData, context) => {
      context?.previousPayments.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error("Gagal menandai lunas. Silakan coba lagi.");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Pembayaran berhasil ditandai lunas!");
    },
  });
};

export const useCreatePaymentLink = () => {
  return useMutation({
    mutationFn: async (paymentId: string) => {
      const res = await fetch(`/api/payments/${paymentId}/create-link`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to create link");
      return res.json();
    },
    onSuccess: (data: { paymentUrl: string }) => {
      navigator.clipboard.writeText(data.paymentUrl);
      toast.success("Link pembayaran disalin ke clipboard!");
    },
    onError: () => {
      toast.error("Gagal membuat link pembayaran.");
    },
  });
};
