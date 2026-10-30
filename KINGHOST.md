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
e o contador recebe um script de aproximadamente 1 KB. A edição e a prévia de desenvolvimento continuam usando React.
A produção do Lovable agora remove a hidratação nas três páginas públicas e usa
o mesmo contador mínimo, sem alterar o HTML visual. Rotas desconhecidas, APIs,
erros e desenvolvimento mantêm o comportamento original. Caso apareça um script
interativo não reconhecido, o servidor preserva a resposta original com React.

As imagens têm variantes responsivas; o navegador baixa a resolução adequada.
As imagens são importadas pelo Vite a partir de `src/media`, gerando nomes com
hash de conteúdo. Assim entram na política de cache dos assets de build e cada
substituição recebe uma URL nova. Livros e bônus também usam AVIF com fallback WebP.
A primeira dobra usa AVIF quando suportado, com fallback WebP, e preloads responsivos
para o fundo e o combo. O fundo também recebe prioridade alta: foi o elemento LCP
identificado no relatório mobile fornecido em 30/10/2026.

O GTM mantém o mesmo ID e enfileira o evento inicial imediatamente, mas injeta o
container após o carregamento, em um intervalo ocioso (com timeout de 1,5 segundo),
ou antes disso no primeiro toque/clique/tecla. Isso evita disputar a primeira
renderização com Analytics, Google Ads e Meta. As tags passam a inicializar mais tarde
em visitas sem interação; o conteúdo, as fontes e os links permanecem iguais.
O CSS inclui apenas as classes das páginas usadas, sem gerar estilos dos componentes
UI de exemplo. Arquivos de imagem e scripts não referenciados são excluídos do pacote.

As regras opcionais de compressão e cache entram em vigor quando `htaccess` é renomeado
para `.htaccess` no servidor e os módulos Apache correspondentes estão disponíveis.
Após enviar o pacote, confira o PageSpeed na URL publicada: a nota também depende
do tempo de resposta da KingHost, do cache e das tags configuradas no GTM.


A execução Actions também verifica o servidor de produção usado pelo Lovable:
HTML sem módulos de hidratação, contador, FAQ, navegação e recarga das páginas legais,
fontes, imagens e checkout. Os relatórios ficam no artifact `black-livros-lovable-auditoria`.
Os scripts de Google/Meta continuam sendo servidos pelos próprios fornecedores; seu
peso e os tempos de execução não podem ser reduzidos pelo build da página sem alterar
a configuração das campanhas no GTM.
