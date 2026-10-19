import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Combo de Livros Black November — Engeteles" },
      { name: "description", content: "Combo de livros de manutenção da Engeteles — Black November." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/combo.html"
      title="Combo de Livros Black November — Engeteles"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100dvh", border: 0, background: "#000" }}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}
