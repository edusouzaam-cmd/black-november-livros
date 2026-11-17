#!/usr/bin/env python3
"""Gera o plugin WordPress do Black November Livros a partir do pacote estático.

Uso (na raiz do repositório):
    bun run build:kinghost            # gera kinghost-package/
    python3 wordpress-plugin/build.py # gera dist/wordpress/engeteles-black-livros.zip
"""
import io
import os
import re
import shutil
import sys
import zipfile

from PIL import Image  # pip install pillow

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_PLUGIN = os.path.join(ROOT, "wordpress-plugin", "engeteles-black-livros")
PACKAGE = os.path.join(ROOT, "kinghost-package")
SLUG = "engeteles-black-livros"
OUT_DIR = os.path.join(ROOT, "dist", "wordpress")
BUILD = os.path.join(OUT_DIR, SLUG)
SITE = os.path.join(BUILD, "site")

BASE = "/black-livros"
ABS_BASE = "https://engeteles.com.br/black-livros"
ASSETS = "{{ENGETELES_BLACK_LIVROS_ASSETS}}"
HOME = "{{ENGETELES_BLACK_LIVROS_HOME}}"
MAX_ZIP = 60 * 1024 * 1024         # limite de upload configurado no WordPress: 64 MB
RECOMPRESS_KB = None               # None = imagens na qualidade original
QUALITY = 64
OG_IMAGE = None                    # imagem de compartilhamento original (sem troca)


def pages():
    out = {}
    for dirpath, _, files in os.walk(PACKAGE):
        if "index.html" in files:
            rel = os.path.relpath(dirpath, PACKAGE)
            out["" if rel == "." else rel.replace(os.sep, "/")] = os.path.join(rel, "index.html").replace(os.sep, "/").lstrip("./") or "index.html"
    return out


def main():
    if not os.path.isdir(PACKAGE):
        sys.exit("kinghost-package/ não existe: rode antes `bun run build:kinghost`.")
    shutil.rmtree(BUILD, ignore_errors=True)
    os.makedirs(SITE)
    for name in os.listdir(SRC_PLUGIN):
        shutil.copy2(os.path.join(SRC_PLUGIN, name), BUILD)

    routes = pages()
    htmls = {route: open(os.path.join(PACKAGE, f), encoding="utf-8").read() for route, f in routes.items()}

    # Imagem de compartilhamento (og:image) aponta para a versão de 1536 px que já está no pacote.
    og_replacement = None if OG_IMAGE is None else next((f for f in sorted(os.listdir(os.path.join(PACKAGE, "assets")))
                           if f.startswith("black-november-livros-1536-") and f.endswith(".webp")), None)

    used = set()
    for route, html in htmls.items():
        if og_replacement:
            html = html.replace("assets/" + OG_IMAGE, "assets/" + og_replacement)
        html = html.replace(ABS_BASE + "/assets/", ASSETS + "/assets/")
        html = html.replace(ABS_BASE, HOME)
        used |= set(re.findall(r'(?<=["\'(\s,=])' + re.escape(BASE) + r'/((?:assets/)?[^"\'\s),/?#]+\.[a-z0-9]+)', html))
        used |= set(re.findall(re.escape(ASSETS) + r'/([^"\'\s),?#]+)', html))
        html = re.sub(r'(?<=["\'(\s,=])' + re.escape(BASE) + r'/((?:assets/)?[^"\'\s),/?#]+\.[a-z0-9]+)', ASSETS + r"/\1", html)
        html = re.sub(r'(?<=["\'(\s,=])' + re.escape(BASE) + r'(?=[/"\'#?])', HOME, html)
        leftover = re.findall(r'(?<![\w}])' + re.escape(BASE) + r'\b', html)
        if leftover:
            sys.exit(f"{route or '/'}: {len(leftover)} caminhos /black-livros sem tratamento")
        htmls[route] = html

    for route, html in htmls.items():
        dest = os.path.join(SITE, routes[route])
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        open(dest, "w", encoding="utf-8").write(html)

    for rel in sorted(used):
        src = os.path.join(PACKAGE, rel)
        if not os.path.isfile(src):
            sys.exit(f"Arquivo referenciado não existe: {rel}")
        dest = os.path.join(SITE, rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        if RECOMPRESS_KB is not None and rel.endswith(".webp") and os.path.getsize(src) > RECOMPRESS_KB * 1024:
            buf = io.BytesIO()
            Image.open(src).save(buf, "WEBP", quality=QUALITY, method=6)
            if buf.tell() < os.path.getsize(src):
                open(dest, "wb").write(buf.getvalue())
                continue
        shutil.copy2(src, dest)

    with open(os.path.join(SITE, "routes.php"), "w", encoding="utf-8") as f:
        f.write("<?php\n// Gerado por wordpress-plugin/build.py\nreturn array(\n")
        for route, file in sorted(routes.items()):
            f.write(f"\t'{route}' => '{file}',\n")
        f.write(");\n")

    for dirpath, _, files in os.walk(BUILD):
        if "index.php" not in files and "index.html" not in files:
            open(os.path.join(dirpath, "index.php"), "w").write("<?php // Silence is golden.\n")

    zip_path = os.path.join(OUT_DIR, SLUG + ".zip")
    if os.path.exists(zip_path):
        os.remove(zip_path)
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for dirpath, _, files in os.walk(BUILD):
            for name in sorted(files):
                full = os.path.join(dirpath, name)
                z.write(full, os.path.relpath(full, OUT_DIR))
    size = os.path.getsize(zip_path)
    print(f"páginas: {', '.join('/' + r for r in sorted(routes))}")
    print(f"arquivos usados: {len(used)}")
    print(f"zip: {zip_path} ({size / 1024 / 1024:.2f} MB)")
    if size > MAX_ZIP:
        sys.exit("Pacote passou de 60 MB (limite de upload configurado no WordPress: 64 MB)")


if __name__ == "__main__":
    main()
