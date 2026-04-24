import { z } from 'zod'

export const createComplaintSchema = z.object({
  roomNumber: z.string().min(1, 'Nomor kamar wajib diisi'),
  tenantName: z.string().min(1, 'Nama penghuni wajib diisi'),
  // category & photoUrl are accepted from UI but not stored in DB schema
  category: z.string().optional(),
  description: z.string().min(10, 'Deskripsi keluhan minimal 10 karakter'),
  photoUrl: z.string().url().optional(),
})

export const updateComplaintStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']),
})

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>
export type UpdateComplaintStatusInput = z.infer<typeof updateComplaintStatusSchema>
