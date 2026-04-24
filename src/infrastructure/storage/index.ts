import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Admin client for storage operations.
 * Uses the service-role key (server-side only — never expose to client).
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? 'kostos-assets';

export interface UploadResult {
  fileId: string;   // Path within the bucket
  publicUrl: string;
}

/**
 * Upload a file to Supabase Storage.
 * @param file   - The file as a Buffer or Blob.
 * @param path   - Destination path inside the bucket (e.g. "complaints/photo.jpg").
 * @param contentType - MIME type of the file.
 */
export async function uploadFile(
  file: Buffer | Blob,
  path: string,
  contentType: string
): Promise<UploadResult> {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data: urlData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return {
    fileId: data.path,
    publicUrl: urlData.publicUrl,
  };
}

/**
 * Delete a file from Supabase Storage by its path (fileId).
 * @param fileId - The path that was returned from uploadFile.
 */
export async function deleteFile(fileId: string): Promise<void> {
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([fileId]);
  if (error) throw new Error(`Storage delete failed: ${error.message}`);
}
