import { publicUrl } from "@/lib/site-url";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Mail, Phone } from "lucide-react";

// Links com "/#" funcionam na home e também trazem o visitante de volta a partir das subpáginas.
const MENU = [
  { href: "/#livros", label: "Livros" },
  { href: "/#bonus", label: "Bônus" },
  { href: "/#oferta", label: "Oferta" },
  { href: "/#faq", label: "Dúvidas" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#00182b]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" aria-label="Engeteles, página inicial">
          <img
            src={publicUrl("/assets/optimized/logo-engeteles-240.webp")}
            srcSet={`${publicUrl("/assets/optimized/logo-engeteles-240.webp")} 240w, ${publicUrl("/assets/optimized/logo-engeteles-360.webp")} 360w`}
            sizes="(min-width: 640px) 119px, 106px"
            decoding="async"
            alt="Engeteles"
            width={1092}
            height={331}
            style={{ aspectRatio: "1092 / 331" }}
            className="h-8 w-auto sm:h-9"
          />
        </Link>
        <nav aria-label="Menu principal" className="hidden md:block">
          <ul className="flex gap-8 text-sm font-semibold text-white/85">
            {MENU.map((item) => (
              <li key={item.href}>
                <a href={publicUrl(item.href)} className="transition hover:text-[#00aeef]">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={publicUrl("/#oferta")}
          className="rounded-full bg-[#00aeef] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#001e33] transition hover:bg-[#29c3fa] sm:px-5 sm:text-sm"
        >
          Comprar combo
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#00182b] px-4 py-10 text-sm text-white">
      <div className="mx-auto grid max-w-5xl items-center gap-8 text-center sm:grid-cols-3 sm:text-left">
        <img
          src={publicUrl("/assets/logo-engeteles-editora.webp")}
          alt="Engeteles Editora"
          width={512}
          height={180}
          loading="lazy"
          className="mx-auto w-40 sm:mx-0"
        />
        <div>
          <p className="mb-2 text-base font-semibold">Contato</p>
          <a
            href="mailto:contato@engeteles.com.br"
            className="flex items-center justify-center gap-2 hover:underline sm:justify-start"
          >
            <Mail className="size-4" aria-hidden /> contato@engeteles.com.br
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=556196502757"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center justify-center gap-2 hover:underline sm:justify-start"
          >
            <Phone className="size-4" aria-hidden /> (61) 99650-2757
          </a>
        </div>
        <div className="text-white/80">
          <p className="font-bold text-white">
            ENGETELES Capacitação Profissional e Consultoria LTDA
          </p>
          <p>CNPJ: 23.607.144/0001-06</p>
          <p className="mt-3 flex justify-center gap-2 sm:justify-start">
            <Link to="/termos-de-uso" className="hover:text-[#00aeef] hover:underline">
              Termos de Uso
            </Link>
            <span aria-hidden>|</span>
            <Link to="/politica-de-privacidade" className="hover:text-[#00aeef] hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div id="topo" className="min-h-screen bg-black font-[Montserrat] text-white antialiased">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

// Modelo das páginas institucionais: faixa de título no padrão da home e texto em coluna legível.
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <SiteShell>
      <main>
        <section className="bg-[radial-gradient(ellipse_at_top,#00325b_0%,#00182b_55%,#000_100%)] px-4 py-16 text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">{title}</h1>
          {updated && <p className="mt-3 text-sm text-white/70">{updated}</p>}
        </section>
        <section className="bg-[#f3f3f3] px-4 py-14 text-[#3f444b]">
          <article className="mx-auto max-w-3xl space-y-4 leading-relaxed [&_h2]:mt-10 [&>h2:first-child]:mt-0[&_h2]:font-[Poppins] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#0058a2] [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#0058a2] [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_strong]:text-[#2c3338] [&_ul]:space-y-3">
            {children}
          </article>
          <p className="mx-auto mt-12 max-w-3xl">
            <Link to="/" className="font-semibold text-[#0058a2] underline">
              Voltar para a oferta
            </Link>
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
