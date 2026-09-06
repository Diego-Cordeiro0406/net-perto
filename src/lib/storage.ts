import { supabase } from "@/integrations/supabase/client";

type StorageBucket = "providers-logos";

/**
 * Upload a file to R2 via the upload-file edge function.
 * Returns { path, url } where url is set for public buckets.
 */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File
): Promise<{ path: string; url: string | null; storedPath: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);
  formData.append("path", path);

  const { data, error } = await supabase.functions.invoke("upload-file", {
    body: formData,
  });

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error || "Upload failed");

  return data;
}

/**
 * Get the public URL for a file in a public bucket.
 * Works without any API call — just builds the URL.
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL;

  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${bucket}/${path}`;
  }
  // Fallback to Supabase Storage if R2_PUBLIC_URL not configured
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/**
 * Delete a file from R2.
 */
export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke("delete-file", {
    body: { bucket, path },
  });

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error || "Delete failed");
}
