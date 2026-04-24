// Ini Server Component — tidak ada "use client"
// Tugasnya: ambil nama properti berdasarkan token, lalu render form

import { PublicComplaintForm } from "@/components/complaints/PublicComplaintForm";
import prisma from "@/lib/prisma";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PublicComplaintPage({ params }: Props) {
  // Next.js 16: params adalah Promise, harus di-await sebelum diakses
  const { token } = await params;

  // Fetch property name from database
  const property = await prisma.property.findUnique({
    where: { complaintToken: token },
    select: { name: true, id: true },
  });

  // If property not found, show error
  if (!property) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-red-600 text-center mb-2">Token Tidak Valid</h1>
          <p className="text-center text-gray-600">
            Link komplain tidak valid atau sudah tidak aktif. Silakan hubungi pemilik properti.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-2">{property.name}</h1>
        <p className="text-center text-gray-500 mb-6">Form Pengaduan Keluhan</p>
        {/* PublicComplaintForm adalah Client Component */}
        <PublicComplaintForm token={token} />
      </div>
    </main>
  );
}
