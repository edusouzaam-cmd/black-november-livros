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

function enhanceFirstFold(frame: HTMLIFrameElement) {
  const doc = frame.contentDocument;
  if (!doc || doc.getElementById("bn-hero-motion")) return;

  const artwork = doc.querySelector<HTMLImageElement>("img.wp-image-1800");
  if (!artwork) return;

  artwork.src = "/assets/black-november-livros.webp";
  artwork.removeAttribute("srcset");
  artwork.removeAttribute("sizes");
  artwork.alt = "Combo de livros Black November Engeteles";
  artwork.classList.remove("elementor-animation-buzz-out");
  artwork.classList.add("bn-hero-art");

  const artworkWidget = doc.querySelector(".elementor-element-b717382");
  artworkWidget?.classList.remove("elementor-invisible");
  artworkWidget?.removeAttribute("data-settings");

  const motion = doc.createElement("style");
  motion.id = "bn-hero-motion";
  motion.textContent = `
    .bn-hero-art {
      display: inline-block;
      width: min(100%, 775px);
      height: auto;
      transform-origin: center;
      will-change: transform, filter;
      filter: drop-shadow(0 18px 34px rgba(0, 0, 0, .42)) drop-shadow(0 0 12px rgba(0, 191, 255, .12));
      animation: bnHeroReveal .9s cubic-bezier(.2, .8, .2, 1) both, bnHeroFloat 7s ease-in-out .9s infinite;
      transition: filter .35s ease;
    }
    .bn-hero-art:hover {
      filter: drop-shadow(0 20px 36px rgba(0, 0, 0, .45)) drop-shadow(0 0 22px rgba(0, 191, 255, .3));
    }
    @keyframes bnHeroReveal {
      from { opacity: 0; transform: translate3d(0, 22px, 0) scale(.965); }
      to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
    }
    @keyframes bnHeroFloat {
      0%, 100% { transform: translate3d(0, 0, 0); }
      50% { transform: translate3d(0, -8px, 0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .bn-hero-art { animation: none; transition: none; opacity: 1; }
    }
  `;
  doc.head.appendChild(motion);
}

function Index() {
  return (
    <iframe
      src="/combo.html"
      title="Combo de Livros Black November — Engeteles"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100dvh", border: 0, background: "#000" }}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      onLoad={(event) => enhanceFirstFold(event.currentTarget)}
    />
  );
}
