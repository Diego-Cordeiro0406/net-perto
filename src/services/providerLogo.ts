import { supabase } from "@/integrations/supabase/client";
import { deleteFile, uploadFile } from "@/lib/storage";

export async function saveProviderLogo({
  providerId,
  newLogo,
  currentLogo,
}: {
  providerId: string;
  newLogo: File;
  currentLogo?: string | null;
}) {
  const extension = newLogo.name.split(".").pop();

  if (!extension) {
    throw new Error("Não foi possível identificar a extensão da imagem.");
  }

  const newPath = `${providerId}/${crypto.randomUUID()}.${extension}`;

  await uploadFile("providers-logos", newPath, newLogo);

  const { error } = await supabase
    .from("providers")
    .update({ logo_url: newPath })
    .eq("id", providerId);

  if (error) {
    // Se o banco falhar, tenta remover o arquivo que acabou de ser enviado.
    try {
      await deleteFile("providers-logos", newPath);
    } catch (cleanupError) {
      console.warn("Erro ao remover nova logo após falha no banco:", cleanupError);
    }

    throw error;
  }

  if (currentLogo) {
    try {
      await deleteFile("providers-logos", currentLogo);
    } catch (error) {
      console.warn("Erro ao deletar logo antiga:", error);
    }
  }

  return newPath;
}
