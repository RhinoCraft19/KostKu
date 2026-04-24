"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Room } from "@/types";
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
import { useEffect } from "react";
import { useCreateRoom, useUpdateRoom } from "@/hooks/useRooms";
import { useAppStore } from "@/store/useAppStore";
import { ImageUploader } from "@/components/shared/ImageUploader";

const roomSchema = z.object({
  roomNumber: z.string().min(1, "Nomor kamar wajib diisi"),
  type: z.string().min(1, "Tipe kamar wajib diisi"),
  price: z.number().min(0, "Harga tidak boleh negatif"),
  facilities: z.array(z.string()),
  photoUrl: z.string().optional().nullable(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface RoomFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room | null;
}

export function RoomForm({ open, onOpenChange, room }: RoomFormProps) {
  const activePropertyId = useAppStore((state) => state.activePropertyId);
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: "",
      type: "STANDAR",
      price: 0,
      facilities: [],
      photoUrl: null,
    },
  });

  useEffect(() => {
    if (room) {
      form.reset({
        roomNumber: room.roomNumber,
        type: room.type,
        price: room.price,
        facilities: room.facilities,
        photoUrl: room.photoUrl || null,
      });
    } else {
      form.reset({
        roomNumber: "",
        type: "STANDAR",
        price: 0,
        facilities: [],
        photoUrl: null,
      });
    }
  }, [room, form]);

  const onSubmit = async (values: RoomFormValues) => {
    if (!activePropertyId) return;

    try {
      if (room) {
        await updateRoom.mutateAsync({
          id: room.id,
          ...values,
        });
      } else {
        await createRoom.mutateAsync({
          ...values,
          propertyId: activePropertyId,
        });
      }
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation toast
    }
  };

  const isPending = createRoom.isPending || updateRoom.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{room ? "Edit Kamar" : "Tambah Kamar Baru"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Kamar</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: A01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Kamar</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EKONOMI">Ekonomi</SelectItem>
                      <SelectItem value="STANDAR">Standar</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Sewa / Bulan</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                      folder="rooms"
                      label="Foto Kamar"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : room ? "Simpan Perubahan" : "Tambah Kamar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
