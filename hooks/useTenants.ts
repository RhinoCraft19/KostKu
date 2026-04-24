import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tenant } from "@/types";
import { toast } from "sonner";

export const useTenants = (propertyId: string | null) => {
  return useQuery({
    queryKey: ["tenants", propertyId],
    queryFn: async (): Promise<Tenant[]> => {
      if (!propertyId) return [];
      const response = await fetch(`/api/tenants?propertyId=${propertyId}`);
      if (!response.ok) throw new Error("Gagal mengambil data tenant");
      return response.json();
    },
    enabled: !!propertyId,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Tenant>) => {
      const response = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mendaftarkan tenant");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Tenant berhasil didaftarkan");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useCheckoutTenant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tenants/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Gagal melakukan checkout tenant");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Tenant telah checkout");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
