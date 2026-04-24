"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateComplaint } from "@/hooks/useComplaints";
import { ImageUploader } from "@/components/shared/ImageUploader"; // pakai ulang komponen lama
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Skema validasi Zod
const schema = z.object({
  tenantName: z.string().min(2, "Nama minimal 2 karakter."),
  roomNumber: z.string().min(1, "Nomor kamar wajib diisi."),
  category: z.enum(["KEBOCORAN", "LISTRIK", "FASILITAS", "LAINNYA"]),
  description: z.string().min(10, "Deskripsi minimal 10 karakter."),
  photoUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  token: string;
}

export function PublicComplaintForm({ token }: Props) {
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isPending } = useCreateComplaint(token);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    mutate(data, {
      onSuccess: () => setIsSuccess(true),
      onError: () => alert("Gagal mengirim. Coba lagi."),
    });
  };

  // Tampilkan halaman sukses setelah form berhasil dikirim
  if (isSuccess) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <p className="text-4xl mb-4">✅</p>
        <h2 className="text-xl font-semibold">Terima kasih!</h2>
        <p className="text-gray-500 mt-2">Keluhan Anda telah diterima dan akan segera diproses.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-4">
      {/* Field: Nama Lengkap */}
      <div>
        <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
        <input {...register("tenantName")} className="input w-full" placeholder="Contoh: Budi Santoso" />
        {errors.tenantName && <p className="text-red-500 text-xs mt-1">{errors.tenantName.message}</p>}
      </div>

      {/* Field: Nomor Kamar */}
      <div>
        <label className="block text-sm font-medium mb-1">Nomor Kamar</label>
        <input {...register("roomNumber")} className="input w-full" placeholder="Contoh: 101" />
        {errors.roomNumber && <p className="text-red-500 text-xs mt-1">{errors.roomNumber.message}</p>}
      </div>

      {/* Field: Kategori */}
      <div>
        <label className="block text-sm font-medium mb-1">Kategori Keluhan</label>
        <select {...register("category")} className="input w-full">
          <option value="KEBOCORAN">Kebocoran</option>
          <option value="LISTRIK">Listrik</option>
          <option value="FASILITAS">Fasilitas</option>
          <option value="LAINNYA">Lainnya</option>
        </select>
      </div>

      {/* Field: Deskripsi */}
      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi Keluhan</label>
        <textarea {...register("description")} className="input w-full" rows={3} placeholder="Jelaskan keluhan Anda..." />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      {/* Field: Foto (opsional) */}
      <div>
        <label className="block text-sm font-medium mb-1">Foto (Opsional)</label>
        <ImageUploader onChange={(url: string) => setValue("photoUrl", url)} />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Mengirim..." : "Kirim Keluhan"}
      </Button>
    </form>
  );
}
