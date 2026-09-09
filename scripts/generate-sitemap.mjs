import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const env = {
  ...loadEnv("production", projectRoot, ""),
  ...process.env,
};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabasePublishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY são obrigatórias."
  );
}

const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

const { data: neighborhoods, error } = await supabase
  .from("neighborhoods")
  .select("city, slug")
  .order("city")
  .order("name");

if (error) {
  throw new Error(`Erro ao buscar bairros: ${error.message}`);
}

const BASE_URL = "https://netperto.com.br";

const urls = [
  `
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  `,
  ...(neighborhoods ?? []).map(
    (neighborhood) => `
  <url>
    <loc>${BASE_URL}/internet/${neighborhood.city.toLowerCase()}/${neighborhood.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `
  ),
].join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const publicDir = path.join(projectRoot, "public");
const sitemapPath = path.join(publicDir, "sitemap.xml");

await mkdir(publicDir, { recursive: true });
await writeFile(sitemapPath, sitemap.trim(), "utf8");

console.log(
  `Sitemap gerado com sucesso: ${neighborhoods?.length ?? 0} bairros.`
);
