# Publicação manual — Black Livros

- Framework: React 19 + TanStack Start/Router e Vite 8.
- Dependências: Bun 1.3.11, lockfile `bun.lock`, instalação `bun install --frozen-lockfile`.
- Node: 22 (compatível com Vite 8).
- Build habitual do Lovable: `bun run build`; configuração de base permanece `/`.
- Build KingHost: `bun run build:kinghost`; base `/black-livros/`.
- Saída estática real: `dist/client`, incluindo HTML pré-renderizado da página principal,
  `/termos-de-uso` e `/politica-de-privacidade`. O bundle de servidor de `dist/server`
  é usado apenas durante a compilação, nunca enviado para a hospedagem.
- Pasta preparada e validada: `kinghost-package/`.

## Baixar e publicar

1. GitHub → Actions → **Gerar pacote KingHost** → execução concluída com sucesso.
2. Em Artifacts, baixe **black-livros-kinghost**. Também é possível gerar uma nova
   execução pelo botão **Run workflow** na branch `main`.
3. Extraia o ZIP. `index.html`, `favicon.ico`, `robots.txt`, `sitemap.xml`, `htaccess`,
   `assets/` e as pastas das páginas devem estar diretamente na raiz extraída.
4. Envie **todo o conteúdo extraído** para a pasta `black-livros` dentro da raiz
   pública do domínio `engeteles.com.br`. Não envie a pasta `kinghost-package` em si.
5. No servidor, renomeie **htaccess** para **.htaccess**. O ponto inicial é necessário
   para o Apache reconhecer as regras. As regras preservam os arquivos e diretórios
   HTML existentes e usam a página principal como fallback.
6. Acesse https://engeteles.com.br/black-livros/ e teste também os links legais e a
   atualização direta das subpáginas.

O `robots.txt` da subpasta **não substitui** o `robots.txt` da raiz do domínio.
Nenhum arquivo de outros sites é alterado. O sitemap está em
https://engeteles.com.br/black-livros/sitemap.xml.

Não há deploy automático nem necessidade de credenciais KingHost. O workflow
valida arquivos, caminhos, favicon original, HTML, metadados e sitemap antes de
publicar o artifact. As mesmas fontes Montserrat e Poppins agora são servidas localmente (WOFF2), com
os mesmos pesos. GTM, WhatsApp e checkout Hotmart continuam usando seus serviços originais.

## Otimização de desempenho

O pacote KingHost mantém o HTML pré-renderizado e remove os scripts de hidratação
React/TanStack. As três páginas usam navegação HTML normal, o FAQ usa `details` nativo
e o contador recebe um script de aproximadamente 1 KB. O build normal do Lovable
continua usando React, para manter a edição e a prévia.

As imagens têm variantes responsivas; o navegador baixa a resolução adequada.
O CSS inclui apenas as classes das páginas usadas, sem gerar estilos dos componentes
UI de exemplo. Arquivos de imagem e scripts não referenciados são excluídos do pacote.

As regras opcionais de compressão e cache entram em vigor quando `htaccess` é renomeado
para `.htaccess` no servidor e os módulos Apache correspondentes estão disponíveis.
Após enviar o pacote, confira o PageSpeed na URL publicada: a nota também depende
do tempo de resposta da KingHost, do cache e das tags configuradas no GTM.
