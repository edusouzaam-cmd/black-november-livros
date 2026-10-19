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

type Book = {
  section: string;
  heading: string;
  description: string;
  descriptionText: string;
  image: string;
  imageAlt: string;
  chapters: string[];
  chapterCount: number;
  pages: number;
  price: string;
  infoList: string;
  priceWidget: string;
  toggleWidget: string;
};

function enhanceFirstFold(frame: HTMLIFrameElement) {
  const doc = frame.contentDocument;
  if (!doc || doc.getElementById("bn-hero-motion")) return;

  const style = doc.createElement("style");
  style.id = "bn-hero-motion";
  style.textContent = `
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
    .bn-countdown { gap: clamp(6px, 1.2vw, 12px); flex-wrap: wrap; }
    .bn-countdown .flip-card {
      width: clamp(64px, 13vw, 86px);
      height: clamp(76px, 14vw, 92px);
      border: 1px solid rgba(0, 191, 255, .35);
      border-radius: 14px;
      background: linear-gradient(145deg, rgba(7, 41, 67, .98), rgba(3, 17, 31, .98));
      box-shadow: 0 10px 28px rgba(0, 0, 0, .28), inset 0 1px 0 rgba(255,255,255,.12);
      backdrop-filter: blur(8px);
    }
    .bn-countdown .flip-card::after { display: none; }
    .bn-countdown .number { font-size: clamp(27px, 5vw, 40px); font-variant-numeric: tabular-nums; }
    .bn-countdown .label { font-size: 9px; letter-spacing: .12em; }
    .bn-chapter-panel { color: inherit; line-height: 1.55; }
    .bn-chapter-panel h3 { margin: 0 0 12px; font-size: 1rem; }
    .bn-chapter-panel ol { margin: 0; padding-left: 1.35rem; }
    .bn-chapter-panel li { margin: 0 0 7px; }
    .bn-separate-books { width: min(1180px, 100%); margin: 0 auto; padding: clamp(36px, 6vw, 72px) 20px; color: #fff; }
    .bn-separate-heading { margin: 0 auto 28px; max-width: 760px; text-align: center; }
    .bn-separate-heading h2 { color: #fff; margin: 0 0 10px; font-size: clamp(26px, 4vw, 38px); line-height: 1.15; }
    .bn-separate-heading p { margin: 0; color: rgba(255,255,255,.76); }
    .bn-book-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
    .bn-book-card { display: flex; flex-direction: column; overflow: hidden; border-radius: 16px; background: #fff; color: #10263b; box-shadow: 0 16px 38px rgba(0,0,0,.24); }
    .bn-book-card img { display: block; width: 100%; aspect-ratio: 1 / 1; object-fit: contain; padding: 12px; background: #f4f6f8; }
    .bn-book-card-content { display: flex; flex: 1; flex-direction: column; padding: 18px; }
    .bn-book-card h3 { margin: 0 0 8px; color: #10263b; font-size: 17px; line-height: 1.25; }
    .bn-book-card .bn-author { margin: 0 0 12px; color: #47586a; font-size: 14px; }
    .bn-book-facts { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 12px; }
    .bn-book-facts span { border-radius: 999px; background: #eef4f8; padding: 6px 10px; font-size: 12px; }
    .bn-book-shipping { margin: 0 0 14px; color: #47586a; font-size: 13px; }
    .bn-book-price { margin: auto 0 14px; color: #071f34; font-size: 22px; font-weight: 800; }
    .bn-book-buy { display: block; border-radius: 9px; background: #04a9e8; color: #001e33 !important; padding: 13px 16px; text-align: center; font-weight: 800; text-decoration: none !important; transition: transform .2s ease, background .2s ease; }
    .bn-book-buy:hover { transform: translateY(-2px); background: #29c3fa; }
    @media (max-width: 820px) { .bn-book-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 560px) { .bn-book-grid { grid-template-columns: 1fr; } }
    @media (prefers-reduced-motion: reduce) { .bn-book-buy { transition: none; } }
  `;
  doc.head.appendChild(style);

  const hero = doc.querySelector<HTMLImageElement>("img.wp-image-1800");
  if (hero) {
    hero.src = "/assets/black-november-livros.webp";
    hero.removeAttribute("srcset");
    hero.removeAttribute("sizes");
    hero.alt = "Combo de livros Black November Engeteles";
    hero.classList.remove("elementor-animation-buzz-out");
    hero.classList.add("bn-hero-art");
    const widget = doc.querySelector(".elementor-element-b717382");
    widget?.classList.remove("elementor-invisible");
    widget?.removeAttribute("data-settings");
  }

  const countdown = doc.querySelector<HTMLElement>(".countdown");
  if (countdown) {
    countdown.classList.add("bn-countdown");
    countdown.setAttribute("role", "timer");
    countdown.setAttribute("aria-label", "Tempo restante da oferta Black November");
    const deadline = new Date("2026-11-30T23:59:59-03:00").getTime();
    const renderCountdown = () => {
      if (!countdown.querySelector("#days")) {
        countdown.innerHTML = `
          <div class="flip-card"><div class="number" id="days">00</div><div class="label">Dias</div></div>
          <div class="flip-card"><div class="number" id="hours">00</div><div class="label">Horas</div></div>
          <div class="flip-card"><div class="number" id="minutes">00</div><div class="label">Minutos</div></div>
          <div class="flip-card"><div class="number" id="seconds">00</div><div class="label">Segundos</div></div>
        `;
      }
      const remaining = Math.max(0, deadline - Date.now());
      const values = [
        String(Math.floor(remaining / 86400000)).padStart(2, "0"),
        String(Math.floor((remaining % 86400000) / 3600000)).padStart(2, "0"),
        String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0"),
        String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0"),
      ];
      ["days", "hours", "minutes", "seconds"].forEach((id, index) => {
        const value = doc.getElementById(id);
        if (value && value.textContent !== values[index]) value.textContent = values[index];
      });
    };
    const Observer = doc.defaultView?.MutationObserver;
    if (Observer) new Observer(renderCountdown).observe(countdown, { childList: true, subtree: true });
    renderCountdown();
    doc.defaultView?.setInterval(renderCountdown, 1000);
  }

  const updateBook = (book: Book) => {
    const section = doc.querySelector<HTMLElement>(book.section);
    if (!section) return;
    const heading = section.querySelector<HTMLElement>(".elementor-widget-heading .elementor-heading-title");
    if (heading) heading.textContent = book.heading;
    const description = section.querySelector<HTMLElement>(book.description);
    if (description) description.textContent = book.descriptionText;
    const image = section.querySelector<HTMLImageElement>(".elementor-widget-image img");
    if (image) {
      image.src = book.image;
      image.removeAttribute("srcset");
      image.removeAttribute("sizes");
      image.alt = book.imageAlt;
    }
    const facts = section.querySelector<HTMLElement>(book.infoList);
    if (facts) facts.textContent = `${book.chapterCount} capítulos · ${book.pages} páginas`;
    const price = section.querySelector<HTMLElement>(book.priceWidget);
    if (price) price.textContent = `R$ ${book.price}`;
    const toggle = section.querySelector<HTMLElement>(book.toggleWidget);
    if (toggle) {
      const panel = doc.createElement("div");
      panel.className = "bn-chapter-panel";
      const label = doc.createElement("h3");
      label.textContent = "Conteúdo do livro";
      const list = doc.createElement("ol");
      book.chapters.forEach((chapter) => {
        const item = doc.createElement("li");
        item.textContent = chapter;
        list.appendChild(item);
      });
      panel.append(label, list);
      toggle.replaceChildren(panel);
    }
  };

  const books: Book[] = [
    {
      section: ".elementor-element-4d0b18b7",
      heading: "Livro PCM Descomplicado — 4ª edição",
      description: ".elementor-element-4cb30b68 .elementor-widget-container",
      descriptionText: "Uma metodologia passo a passo para implantar e gerenciar um setor de Planejamento e Controle da Manutenção.",
      image: "/assets/books/pcm-descomplicado-4a.webp",
      imageAlt: "Livro PCM Descomplicado, quarta edição",
      chapters: [
        "A evolução da manutenção",
        "Tipos e estratégias de manutenção",
        "Estrutura, papéis e conceitos do PCM",
        "Planejamento da manutenção",
        "Programação da manutenção",
        "Controle da manutenção",
        "Cadastro e hierarquização de ativos",
        "Documentação das atividades de manutenção",
        "Construção dos planos de manutenção",
        "Indicadores de manutenção",
        "Gestão de custos da manutenção",
        "Implantação do PCM",
      ],
      chapterCount: 12,
      pages: 290,
      price: "137,00",
      infoList: ".elementor-element-1aac1eb5 .elementor-icon-list-text",
      priceWidget: ".elementor-element-1e7a7749 .elementor-widget-container",
      toggleWidget: ".elementor-element-4b7d5c38 .elementor-widget-container",
    },
    {
      section: ".elementor-element-7e886528",
      heading: "Livro GFM — Gestão Financeira da Manutenção",
      description: ".elementor-element-1ac1b49 .elementor-widget-container",
      descriptionText: "Aprenda a planejar orçamentos, controlar custos e tomar decisões financeiras estratégicas na manutenção.",
      image: "/mirror/livros.engeteles.com.br/wp-content/uploads/2025/04/Sem-nome-1536-x-1024-px-1.png",
      imageAlt: "Livro Gestão Financeira da Manutenção",
      chapters: [
        "Introdução à Gestão Financeira Empresarial",
        "Gestão Financeira aplicada à Manutenção de Ativos",
        "Planejamento Orçamentário do Departamento de Manutenção",
        "Custo do Ciclo de Vida do Ativo (LCC)",
        "Gestão do Capex de Manutenção",
        "Gestão do Opex de Manutenção",
        "Métricas e Indicadores para Gestão Financeira da Manutenção",
        "Decisões Financeiras Estratégicas para Manutenção",
      ],
      chapterCount: 8,
      pages: 248,
      price: "137,00",
      infoList: ".elementor-element-296cc4bf .elementor-icon-list-text",
      priceWidget: ".elementor-element-190e44a0 .elementor-widget-container",
      toggleWidget: ".elementor-element-73bbd135 .elementor-widget-container",
    },
    {
      section: ".elementor-element-3b7bdeab",
      heading: "Livro Não Existe Melhoria de Processos sem o Desenvolvimento de Pessoas",
      description: ".elementor-element-21aa40d1 .elementor-widget-container",
      descriptionText: "Um manual para desenvolver pessoas e melhorar processos no ambiente de manutenção.",
      image: "/assets/books/nao-existe-melhoria-pessoas.webp",
      imageAlt: "Livro Não Existe Melhoria de Processos sem o Desenvolvimento de Pessoas",
      chapters: [
        "Desenvolvimento de Si",
        "Desenvolvimento do Outro",
        "Desenvolvimento da Equipe",
        "Implantação de Processos",
        "Melhoria de Processos",
        "Eliminação de Processos",
      ],
      chapterCount: 6,
      pages: 219,
      price: "99,00",
      infoList: ".elementor-element-5f84e48 .elementor-icon-list-text",
      priceWidget: ".elementor-element-7ba846a3 .elementor-widget-container",
      toggleWidget: ".elementor-element-7fd4d04c .elementor-widget-container",
    },
  ];

  books.forEach(updateBook);
  doc.querySelector(".elementor-element-3663903")?.remove();
  doc.querySelector(".elementor-element-6b41e238")?.remove();

  const combo = doc.querySelector<HTMLElement>(".elementor-element-8b0b462");
  if (combo) {
    const copy = combo.querySelector<HTMLElement>(".elementor-element-191dbf9e .elementor-widget-container");
    if (copy) copy.textContent = "Os três livros e a Formação para Planejadores de Manutenção por quase metade do preço.";
    const items = Array.from(combo.querySelectorAll<HTMLElement>(".elementor-element-1e09bd4d .elementor-icon-list-item"));
    const offers = [
      "<b>Livro 1</b> — PCM Descomplicado — <s>R$ 137,00</s>",
      "<b>Livro 2</b> — GFM — <s>R$ 137,00</s>",
      "<b>Livro 3</b> — Não Existe Melhoria de Processos — <s>R$ 99,00</s>",
      "<b>Bônus</b> — Formação para Planejadores de Manutenção — <s>R$ 227,00</s>",
    ];
    items.forEach((item, index) => {
      if (!offers[index]) { item.remove(); return; }
      const text = item.querySelector<HTMLElement>(".elementor-icon-list-text");
      if (text) text.innerHTML = offers[index];
    });
    const oldTotal = combo.querySelector<HTMLElement>(".elementor-element-448c4370 .elementor-widget-container");
    if (oldTotal) oldTotal.innerHTML = 'De <strong><s>R$ 600,00</s></strong>';
    const finalPrice = combo.querySelector<HTMLElement>(".elementor-element-32440c29 .elementor-heading-title");
    if (finalPrice) finalPrice.innerHTML = 'Por <strong>R$ 299,00</strong> à vista';
    combo.querySelector(".elementor-element-716e81c5")?.remove();
    combo.querySelector(".elementor-element-11c49ec2")?.remove();
  }

  const separate = doc.querySelector<HTMLElement>(".elementor-element-387d49ae");
  if (separate) {
    const cards = [
      {
        title: "PCM — Planejamento e Controle da Manutenção Descomplicado (4ª edição)",
        image: "/assets/books/pcm-descomplicado-4a.webp",
        alt: "Livro PCM Descomplicado, quarta edição",
        chapters: 12,
        pages: 290,
        price: "R$ 137,00",
        href: "https://livros.engeteles.com.br/livro-pcm/",
      },
      {
        title: "GFM — Gestão Financeira da Manutenção",
        image: "/mirror/livros.engeteles.com.br/wp-content/uploads/2025/04/Sem-nome-1536-x-1024-px-1.png",
        alt: "Livro Gestão Financeira da Manutenção",
        chapters: 8,
        pages: 248,
        price: "R$ 137,00",
        href: "https://livros.engeteles.com.br/livro-gfm/",
      },
      {
        title: "Não Existe Melhoria de Processos sem o Desenvolvimento de Pessoas",
        image: "/assets/books/nao-existe-melhoria-pessoas.webp",
        alt: "Livro Não Existe Melhoria de Processos sem o Desenvolvimento de Pessoas",
        chapters: 6,
        pages: 219,
        price: "R$ 99,00",
        href: "https://livros.engeteles.com.br/nemp/",
      },
    ];
    separate.innerHTML = `
      <div class="bn-separate-books">
        <header class="bn-separate-heading">
          <h2>Compre os livros separadamente</h2>
          <p>Escolha o livro ideal para fortalecer sua gestão da manutenção.</p>
        </header>
        <div class="bn-book-grid">
          ${cards.map((book) => `
            <article class="bn-book-card">
              <img src="${book.image}" alt="${book.alt}" loading="lazy">
              <div class="bn-book-card-content">
                <h3>${book.title}</h3>
                <p class="bn-author">Autor: Jhonata Teles</p>
                <div class="bn-book-facts">
                  <span>${book.chapters} capítulos</span>
                  <span>${book.pages} páginas</span>
                </div>
                <p class="bn-book-shipping">Frete grátis para todo o Brasil</p>
                <p class="bn-book-price">${book.price}</p>
                <a class="bn-book-buy" href="${book.href}" target="_blank" rel="noopener noreferrer">Comprar agora</a>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }
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
