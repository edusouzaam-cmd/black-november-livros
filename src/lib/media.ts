// Vite emits content-hashed URLs so production can cache images long-term
// without serving an old image when an asset is replaced.
const files = import.meta.glob<string>("../media/*.{webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

export function mediaUrl(name: string): string {
  const url = files[`../media/${name}`];
  if (!url) throw new Error(`Imagem não encontrada: ${name}`);
  return url;
}
