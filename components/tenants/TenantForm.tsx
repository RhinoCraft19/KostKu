"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTenants, useCreateTenant } from "@/hooks/useTenants";
import { useRooms } from "@/hooks/useRooms";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";
import { ImageUploader } from "@/components/shared/ImageUploader";

const tenantSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(10, "Nomor HP tidak valid"),
  idNumber: z.string().length(16, "NIK harus 16 digit"),
  roomId: z.string().min(1, "Pilih kamar"),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().min(1, "Tanggal selesai wajib diisi"),
  monthlyRent: z.number().min(0),
  idPhotoUrl: z.string().optional().nullable(),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

interface TenantFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TenantForm({ open, onOpenChange }: TenantFormProps) {
  const activePropertyId = useAppStore((state) => state.activePropertyId);
  const { data: rooms } = useRooms(activePropertyId);
  const createTenant = useCreateTenant();

  const vacantRooms = rooms?.filter((r) => r.status === "VACANT") || [];

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: "",
      phone: "",
      idNumber: "",
      roomId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      monthlyRent: 0,
      idPhotoUrl: null,
    },
  });

  // Auto-set monthly rent when room is selected
  const selectedRoomId = form.watch("roomId");
  useEffect(() => {
    const room = rooms?.find((r) => r.id === selectedRoomId);
    if (room) {
      form.setValue("monthlyRent", room.price);
    }
  }, [selectedRoomId, rooms, form]);

  const onSubmit = async (values: TenantFormValues) => {
    try {
      await createTenant.mutateAsync(values);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrasi Tenant Baru</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor HP</FormLabel>
                    <FormControl>
                      <Input placeholder="0812..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor KTP (NIK)</FormLabel>
                  <FormControl>
                    <Input placeholder="16 digit NIK" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih Kamar</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kamar tersedia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vacantRooms.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          Kamar {r.roomNumber} - {r.type}
                        </SelectItem>
                      ))}
                      {vacantRooms.length === 0 && (
                        <SelectItem value="none" disabled>Semua kamar terisi</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Mulai</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Selesai</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="monthlyRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Sewa Sepakat / Bulan</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idPhotoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                      folder="tenants"
                      label="Foto KTP"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={createTenant.isPending}>
                {createTenant.isPending ? "Mendaftarkan..." : "Daftarkan Tenant"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

