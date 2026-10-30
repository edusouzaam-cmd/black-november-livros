import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { optimizeStatic } from "./optimize-static.mjs";

// TanStack Start emits the prerendered client to dist/client. Nitro may copy
// it to .output/public; never package its server bundle.
const source = ["dist/client", ".output/public"].find((dir) => existsSync(`${dir}/index.html`));
if (!source) throw new Error("Build não produziu index.html estático.");
const destination = "kinghost-package";
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination);
cpSync(source, destination, { recursive: true });
optimizeStatic(destination);
mkdirSync(`${destination}/licenses`, { recursive: true });
for (const family of ["Montserrat", "Poppins"]) {
  cpSync(`src/fonts/OFL-${family}.txt`, `${destination}/licenses/OFL-${family}.txt`);
}
writeFileSync(
  `${destination}/htaccess`,
  `# Ativar no servidor renomeando htaccess para .htaccess.
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/avif "access plus 1 month"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 month"
</IfModule>
<IfModule mod_headers.c>
  <FilesMatch "\\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>

RewriteEngine On
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
