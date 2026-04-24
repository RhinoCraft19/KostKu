import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Complaint, ComplaintFilter, CreateComplaintInput } from "@/types";
import { toast } from "sonner";

// === HOOK 1: Fetch daftar keluhan ===
export function useComplaints(propertyId: string, filter: ComplaintFilter) {
  return useQuery<Complaint[]>({
    queryKey: ["complaints", propertyId, filter],
    queryFn: async () => {
      const params = new URLSearchParams({ propertyId });
      if (filter.status && filter.status !== "ALL") {
        params.set("status", filter.status);
      }
      const res = await fetch(`/api/complaints?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal mengambil data keluhan.");
      return res.json();
    },
    enabled: !!propertyId, // hanya fetch jika propertyId ada
  });
}

// === HOOK 2: Update status keluhan (dengan Optimistic Update) ===
// Optimistic Update = UI langsung berubah SEBELUM server merespons.
// Jika server error, UI dikembalikan ke kondisi semula.
export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/complaints/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status.");
      return res.json();
    },

    // Langkah optimistic update:
    onMutate: async ({ id, status }) => {
      // 1. Batalkan fetch yang sedang berjalan agar tidak overwrite perubahan kita
      await queryClient.cancelQueries({ queryKey: ["complaints"] });

      // 2. Simpan data lama sebagai backup
      const previousData = queryClient.getQueriesData({ queryKey: ["complaints"] });

      // 3. Update cache secara langsung (UI langsung berubah)
      queryClient.setQueriesData(
        { queryKey: ["complaints"] },
        (old: Complaint[] | undefined) =>
          old?.map((c) => (c.id === id ? { ...c, status } : c))
      );

      // 4. Return backup agar bisa dipakai di onError
      return { previousData };
    },

    onError: (_err, _vars, context) => {
      // Jika error, kembalikan data ke kondisi semula
      context?.previousData.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error("Gagal mengubah status keluhan. Silakan coba lagi.");
    },

    onSuccess: () => {
      toast.success("Status keluhan berhasil diperbarui.");
      // Refresh data dari server untuk memastikan sinkronisasi
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
}

// === HOOK 3: Submit keluhan baru (dari public form) ===
export function useCreateComplaint(token: string) {
  return useMutation({
    mutationFn: async (data: CreateComplaintInput) => {
      const res = await fetch(`/api/complaint-form/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal mengirim keluhan.");
      return res.json();
    },
  });
}
