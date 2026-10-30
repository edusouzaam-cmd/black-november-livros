import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// TanStack Start emits the prerendered client to dist/client. Nitro may copy
// it to .output/public; never package its server bundle.
const source = ["dist/client", ".output/public"].find((dir) => existsSync(`${dir}/index.html`));
if (!source) throw new Error("Build não produziu index.html estático.");
const destination = "kinghost-package";
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination);
cpSync(source, destination, { recursive: true });
writeFileSync(
  `${destination}/htaccess`,
  `RewriteEngine On
RewriteBase /black-livros/

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

RewriteRule ^ index.html [L]
`,
);
writeFileSync(
  `${destination}/robots.txt`,
  `User-agent: *
Allow: /

Sitemap: https://engeteles.com.br/black-livros/sitemap.xml
`,
);
const pages = ["", "termos-de-uso", "politica-de-privacidade"];
writeFileSync(
  `${destination}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>https://engeteles.com.br/black-livros/${page}</loc></url>`).join("\n")}
</urlset>
`,
);
// Only browser files belong in the archive; no build manifests or sourcemaps.
for (const file of [".htaccess", ".DS_Store", "_headers", "_redirects"]) {
  rmSync(`${destination}/${file}`, { force: true });
}
console.log(`Pacote público preparado em ${resolve(destination)} a partir de ${source}.`);
