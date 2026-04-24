import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Room } from "@/types";
import { toast } from "sonner";

export const useRooms = (propertyId: string | null) => {
  return useQuery({
    queryKey: ["rooms", propertyId],
    queryFn: async (): Promise<Room[]> => {
      if (!propertyId) return [];
      const response = await fetch(`/api/rooms?propertyId=${propertyId}`);
      if (!response.ok) throw new Error("Gagal mengambil data kamar");
      return response.json();
    },
    enabled: !!propertyId,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Room>) => {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Gagal menambahkan kamar");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Kamar berhasil ditambahkan");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Room> & { id: string }) => {
      const response = await fetch(`/api/rooms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Gagal memperbarui kamar");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Data kamar diperbarui");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/rooms/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghapus kamar");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Kamar dihapus");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
