import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Black November Livros 2026" },
      { name: "description", content: "Black November Livros 2026 — ofertas especiais em livros." },
      { property: "og:title", content: "Black November Livros 2026" },
      { property: "og:description", content: "Black November Livros 2026 — ofertas especiais em livros." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <h1 className="text-center text-5xl font-black tracking-tight text-foreground md:text-7xl">
        BLACK NOVEMBER LIVROS 2026
      </h1>
    </main>
  );
}
