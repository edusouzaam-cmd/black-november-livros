import { mediaUrl } from "@/lib/media";
import { productionUrl } from "@/lib/site-url";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Gift,
  MonitorPlay,
  Award,
  Truck,
  User,
} from "lucide-react";

import { SiteShell } from "@/components/site/site-layout";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "canonical", href: productionUrl("") },
      {
        rel: "preload",
        as: "image",
        type: "image/avif",
        href: mediaUrl("fundo-industria-960.avif"),
        imageSrcSet: `${mediaUrl("fundo-industria-960.avif")} 960w, ${mediaUrl("fundo-industria-1672.avif")} 1672w`,
        imageSizes: "100vw",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        as: "image",
        type: "image/avif",
        href: mediaUrl("black-november-livros-768.avif"),
        imageSrcSet: [480, 768, 1536]
          .map((width) => `${mediaUrl(`black-november-livros-${width}.avif`)} ${width}w`)
          .join(", "),
        imageSizes: "(min-width: 800px) 768px, calc(100vw - 32px)",
        fetchPriority: "high",
      },
    ],
    meta: [
      { property: "og:title", content: "Combo de Livros Black November — Engeteles" },
      { property: "og:url", content: productionUrl("") },
      { title: "Combo de Livros Black November — Engeteles" },
      {
        name: "description",
        content:
          "Combo de livros de manutenção da Engeteles com curso bônus e frete grátis. Oferta Black November.",
      },
    ],
  }),
  component: Index,
});

// Oferta: edite aqui preços, links e prazo.
const DEADLINE = new Date("2026-11-30T23:59:59-03:00").getTime();
const COMBO_CHECKOUT = "https://pay.hotmart.com/F102672953E?off=ryyv0785";
const COMBO_FROM = "R$ 600,00";
const COMBO_PRICE = "R$ 299,00";

type Book = {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  imageSrcSet: string;
  imageAvifSrcSet: string;
  pages: number;
  chapters: string[];
  price: string;
  href: string;
};

const BOOKS: Book[] = [
  {
    id: "pcm",
    title: "PCM Descomplicado — 4ª edição",
    shortTitle: "PCM Descomplicado",
    subtitle:
      "Uma metodologia passo a passo para implantar e gerenciar um setor de Planejamento e Controle da Manutenção.",
    image: mediaUrl("pcm-descomplicado-4a-640.webp"),
    imageAvifSrcSet: [320, 640, 1024]
      .map((width) => `${mediaUrl(`pcm-descomplicado-4a-${width}.avif`)} ${width}w`)
      .join(", "),
    imageSrcSet: [320, 640, 1024]
      .map((width) => `${mediaUrl(`pcm-descomplicado-4a-${width}.webp`)} ${width}w`)
      .join(", "),
    imageAlt: "Livro PCM Descomplicado, quarta edição",
    pages: 290,
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
    price: "R$ 137,00",
    href: "https://livros.engeteles.com.br/livro-pcm/",
  },
  {
    id: "gfm",
    title: "GFM — Gestão Financeira da Manutenção",
    shortTitle: "Gestão Financeira da Manutenção",
    subtitle:
      "Aprenda a planejar orçamentos, controlar custos e tomar decisões financeiras estratégicas na manutenção.",
    image: mediaUrl("gestao-financeira-manutencao-640.webp"),
    imageAvifSrcSet: [320, 640, 1024]
      .map((width) => `${mediaUrl(`gestao-financeira-manutencao-${width}.avif`)} ${width}w`)
      .join(", "),
    imageSrcSet: [320, 640, 1024]
      .map((width) => `${mediaUrl(`gestao-financeira-manutencao-${width}.webp`)} ${width}w`)
      .join(", "),
    imageAlt: "Livro Gestão Financeira da Manutenção, segunda edição",
    pages: 248,
    chapters: [
      "Introdução à gestão financeira empresarial",
      "Gestão financeira aplicada à manutenção de ativos",
      "Planejamento orçamentário do departamento de manutenção",
      "Custo do ciclo de vida do ativo (LCC)",
      "Gestão do Capex de manutenção",
      "Gestão do Opex de manutenção",
      "Métricas e indicadores para gestão financeira da manutenção",
      "Decisões financeiras estratégicas para manutenção",
    ],
    price: "R$ 137,00",
    href: "https://livros.engeteles.com.br/livro-gfm/",
  },
  {
    id: "nemp",
    title: "Não Existe Melhoria de Processos sem o Desenvolvimento de Pessoas",
    shortTitle: "Não Existe Melhoria de Processos",
    subtitle: "Um manual para desenvolver pessoas e melhorar processos no ambiente de manutenção.",
    image: mediaUrl("nao-existe-melhoria-pessoas-640.webp"),
    imageAvifSrcSet: [320, 640, 1024]
      .map((width) => `${mediaUrl(`nao-existe-melhoria-pessoas-${width}.avif`)} ${width}w`)
      .join(", "),
    imageSrcSet: [320, 640, 1024]
      .map((width) => `${mediaUrl(`nao-existe-melhoria-pessoas-${width}.webp`)} ${width}w`)
      .join(", "),
    imageAlt: "Livro Não Existe Melhoria de Processos sem o Desenvolvimento de Pessoas",
    pages: 219,
    chapters: [
      "Desenvolvimento de si",
      "Desenvolvimento do outro",
      "Desenvolvimento da equipe",
      "Implantação de processos",
      "Melhoria de processos",
      "Eliminação de processos",
    ],
    price: "R$ 99,00",
    href: "https://livros.engeteles.com.br/nemp/",
  },
];

const BONUS = {
  title: "Formação para Planejadores de Manutenção",
  price: "R$ 227,00",
  lessons: [
    "Visão geral do que de fato é Planejamento de Manutenção",
    "Seven Questions Planning",
    "O papel do planejador de manutenção e a rotina do planejamento",
    "Criando o inventário de ativos",
    "Matriz de criticidade de ativos no Excel",
    "FMEA no Excel",
    "Como definir as atividades corretas para os planos de manutenção",
    "Como definir as frequências de manutenção corretamente",
    "Como elaborar uma matriz de conhecimento, habilidade e atitude",
    "Como definir corretamente os recursos para atividades de manutenção",
    "Como elaborar procedimentos de manutenção com base na confiabilidade humana",
    "Como ser um planejador de manutenção disputado no mercado de trabalho",
  ],
};

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: "Por que está tão barato?",
    a: "Disponibilizar este conteúdo por um preço acessível foi a forma que encontramos de levar a mais pessoas um pedaço do que ensinamos em nossos treinamentos, para aplicação prática no dia a dia.",
  },
  {
    q: "Será emitida nota fiscal?",
    a: "Sim. Para pessoa física ou jurídica, a nota fiscal é emitida após o fim da garantia incondicional de 7 dias, contados da aprovação da compra.",
  },
  {
    q: "Empresas podem adquirir o combo?",
    a: (
      <>
        Sim. Solicite uma proposta pelo e-mail{" "}
        <a href="mailto:comercial01@engeteles.com.br">comercial01@engeteles.com.br</a>.
      </>
    ),
  },
  {
    q: "Vou receber o combo em casa?",
    a: "Os livros são enviados pelos Correios. Em algumas regiões os Correios não fazem entrega domiciliar, então acompanhe o código de rastreamento enviado por e-mail e verifique se é preciso retirar o pacote na agência.",
  },
  {
    q: "O que acontece se eu não atender o entregador?",
    a: "Os Correios tentam a entrega cerca de duas vezes. Se o pacote não for retirado na agência, ele volta para a Engeteles e o novo envio custa R$ 20,00.",
  },
  {
    q: "Qual o prazo de garantia?",
    a: "A garantia é de 7 dias corridos. Como o envio acontece em até 1 dia útil, um cancelamento após o envio exige receber o livro, devolvê-lo à Engeteles e aguardar a chegada do exemplar para o reembolso.",
  },
  {
    q: "Tenho acesso aos livros do combo em PDF?",
    a: "Não. Os livros têm apenas versão física.",
  },
  {
    q: "Qual o prazo para envio dos livros?",
    a: "O envio acontece 1 dia útil após a confirmação do pagamento. A entrega leva até 10 dias úteis em regiões metropolitanas e grandes centros, e até 18 dias úteis em regiões remotas.",
  },
  {
    q: "Como irei acompanhar a entrega do combo?",
    a: (
      <>
        O código de rastreamento chega automaticamente no e-mail da compra assim que os livros são
        postados. Se não receber, fale com a editora em{" "}
        <a href="mailto:editora@engeteles.com.br">editora@engeteles.com.br</a> ou pelo telefone (61)
        98272-5952.
      </>
    ),
  },
  {
    q: "Moro fora do país. Posso adquirir o combo?",
    a: (
      <>
        Sim, mas o frete grátis vale apenas para o Brasil. O frete internacional é pago por
        transferência bancária mediante invoice, e a postagem ocorre em até 5 dias úteis após o
        pagamento. Consulte valores e prazos em{" "}
        <a href="mailto:editora@engeteles.com.br">editora@engeteles.com.br</a>.
      </>
    ),
  },
];

function useCountdown(deadline: number) {
  // null no servidor e no primeiro render, para não divergir na hidratação.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const left = now === null ? 0 : Math.max(0, deadline - now);
  return {
    ready: now !== null,
    ended: now !== null && left === 0,
    parts: [
      { label: "Dias", value: Math.floor(left / 86_400_000) },
      { label: "Horas", value: Math.floor((left % 86_400_000) / 3_600_000) },
      { label: "Minutos", value: Math.floor((left % 3_600_000) / 60_000) },
      { label: "Segundos", value: Math.floor((left % 60_000) / 1000) },
    ],
  };
}

function Countdown() {
  const { ready, ended, parts } = useCountdown(DEADLINE);
  if (ended) return <p className="font-semibold text-[#00aeef]">Oferta encerrada</p>;
  return (
    <div
      role="timer"
      data-offer-deadline={DEADLINE}
      aria-label="Tempo restante da oferta Black November"
      className="flex justify-center gap-2 sm:gap-3"
    >
      {parts.map((p, index) => (
        <div
          key={p.label}
          className="flex w-16 flex-col items-center rounded-xl border border-[#00aeef]/35 bg-gradient-to-b from-[#072943] to-[#03111f] py-2 shadow-lg sm:w-20 sm:py-3"
        >
          <span
            data-countdown-part={index}
            className="text-2xl font-bold tabular-nums text-white sm:text-4xl"
          >
            {ready ? String(p.value).padStart(2, "0") : "--"}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-white/70">{p.label}</span>
        </div>
      ))}
    </div>
  );
}

function CtaButton({ children = "Quero adquirir meu combo" }: { children?: ReactNode }) {
  return (
    <a
      href={COMBO_CHECKOUT}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-full bg-gradient-to-r from-[#49c3db] to-[#306880] px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white sm:px-8 sm:tracking-[0.2em] shadow-[0_0_25px_rgba(0,174,239,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(0,174,239,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
    >
      {children}
    </a>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mx-auto mb-10 max-w-3xl text-center">
      <h2 className="font-[Poppins] text-2xl font-bold leading-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-base text-white/75 sm:text-lg">{subtitle}</p>}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_top,#00325b_0%,#00182b_55%,#000_100%)] px-4 pb-16 pt-10 text-center">
      {/* Foto decorativa em P&B, bem apagada, só para dar clima de indústria. */}
      <picture className="contents">
        <source
          className="hidden"
          type="image/avif"
          srcSet={`${mediaUrl("fundo-industria-960.avif")} 960w, ${mediaUrl("fundo-industria-1672.avif")} 1672w`}
          sizes="100vw"
        />
        <img
          src={mediaUrl("fundo-industria-1672.webp")}
          srcSet={`${mediaUrl("fundo-industria-960.webp")} 960w, ${mediaUrl("fundo-industria-1672.webp")} 1672w`}
          sizes="100vw"
          width={1672}
          height={941}
          decoding="async"
          fetchPriority="high"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.22] mix-blend-luminosity"
        />
      </picture>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#00182b]/40 via-[#00182b]/60 to-black"
      />
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#00aeef]">
        A oferta termina em
      </p>
      <Countdown />
      <picture className="contents">
        <source
          className="hidden"
          type="image/avif"
          srcSet={[480, 768, 1536]
            .map((width) => `${mediaUrl(`black-november-livros-${width}.avif`)} ${width}w`)
            .join(", ")}
          sizes="(min-width: 800px) 768px, calc(100vw - 32px)"
        />
        <img
          src={mediaUrl("black-november-livros-768.webp")}
          srcSet={[480, 768, 1536]
            .map((width) => `${mediaUrl(`black-november-livros-${width}.webp`)} ${width}w`)
            .join(", ")}
          sizes="(min-width: 800px) 768px, calc(100vw - 32px)"
          decoding="async"
          alt="Livros PCM Descomplicado, Não Existe Melhoria de Processos e Gestão Financeira da Manutenção com o selo Black November"
          width={1653}
          height={952}
          style={{ aspectRatio: "1653 / 952" }}
          fetchPriority="high"
          className="mx-auto mt-8 w-full max-w-3xl drop-shadow-[0_18px_34px_rgba(0,0,0,0.45)] motion-safe:animate-[bn-float_7s_ease-in-out_infinite]"
        />
      </picture>
      <h1 className="mt-6 font-[Montserrat] text-4xl font-extrabold leading-tight text-white sm:text-6xl lg:text-7xl">
        Combo de livros <span className="text-[#00aeef]">pela metade do preço</span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-white/85 sm:text-xl">
        3 livros essenciais para profissionais da manutenção + Formação para Planejadores de
        Manutenção em uma única oferta.
      </p>
      <div className="mt-8">
        <CtaButton />
      </div>
      <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-base font-medium uppercase text-white sm:text-lg">
        <li className="flex items-center gap-2">
          <Truck className="size-5 text-[#00aeef]" aria-hidden /> Frete grátis para todo o Brasil
        </li>
        <li className="flex items-center gap-2">
          <Gift className="size-5 text-[#00aeef]" aria-hidden /> Bônus: curso online
        </li>
      </ul>
    </section>
  );
}

function BookSection({ book, index }: { book: Book; index: number }) {
  const reverse = index % 2 === 1;
  return (
    <article id={book.id} className="mx-auto max-w-5xl scroll-mt-8">
      <SectionTitle title={`Livro ${book.title}`} subtitle={book.subtitle} />
      <div
        className={`grid overflow-hidden rounded-2xl border border-[#0058a2]/60 bg-[#000c17]/60 md:grid-cols-2 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
      >
        <div className="flex flex-col items-center justify-center gap-4 bg-[radial-gradient(#00264f,#00192f)] p-8">
          <picture className="contents">
            <source
              className="hidden"
              type="image/avif"
              srcSet={book.imageAvifSrcSet}
              sizes="(min-width: 416px) 320px, calc(100vw - 98px)"
            />
            <img
              src={book.image}
              srcSet={book.imageSrcSet}
              sizes="(min-width: 416px) 320px, calc(100vw - 98px)"
              width={640}
              height={640}
              decoding="async"
              alt={book.imageAlt}
              loading="lazy"
              className="aspect-square w-full max-w-xs object-cover"
            />
          </picture>
          <ul className="space-y-1 text-white/90">
            <li className="flex items-center gap-2">
              <BookOpen className="size-4 text-[#00aeef]" aria-hidden /> {book.pages} páginas ·{" "}
              {book.chapters.length} capítulos
            </li>
            <li className="flex items-center gap-2">
              <User className="size-4 text-[#00aeef]" aria-hidden /> Autor: Jhonata Teles
            </li>
          </ul>
        </div>
        <div className="p-6 sm:p-8">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#00aeef]">
            Conteúdo do livro
          </h3>
          <ol className="divide-y divide-white/10">
            {book.chapters.map((chapter, i) => (
              <li key={chapter} className="flex gap-3 py-2.5">
                <span className="w-6 shrink-0 text-right text-sm font-bold tabular-nums text-[#00aeef]">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold uppercase text-white">{chapter}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="mt-6 text-center text-2xl font-bold text-[#ff4d4d]">
        De <s>{book.price}</s>
      </p>
    </article>
  );
}

function BonusSection() {
  return (
    <section id="bonus" className="scroll-mt-16 bg-[#00325b] px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          title="Ganhe um curso online de bônus ao adquirir o combo"
          subtitle={BONUS.title}
        />
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="text-center">
            <picture className="contents">
              <source
                className="hidden"
                type="image/avif"
                srcSet={`${mediaUrl("curso-planejadores-448.avif")} 448w, ${mediaUrl("curso-planejadores-896.avif")} 896w`}
                sizes="(min-width: 480px) 448px, calc(100vw - 32px)"
              />
              <img
                src={mediaUrl("curso-planejadores-896.webp")}
                srcSet={`${mediaUrl("curso-planejadores-448.webp")} 448w, ${mediaUrl("curso-planejadores-896.webp")} 896w`}
                sizes="(min-width: 480px) 448px, calc(100vw - 32px)"
                decoding="async"
                alt="Curso Formação para Planejadores de Manutenção aberto em um notebook"
                loading="lazy"
                width={1024}
                height={819}
                className="mx-auto w-full max-w-md"
              />
            </picture>
            <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-white">
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-[#00aeef]" aria-hidden /> 20 horas
              </li>
              <li className="flex items-center gap-2">
                <Award className="size-4 text-[#00aeef]" aria-hidden /> Com certificado
              </li>
              <li className="flex items-center gap-2">
                <MonitorPlay className="size-4 text-[#00aeef]" aria-hidden /> {BONUS.lessons.length}{" "}
                aulas
              </li>
            </ul>
            <p className="mt-4 text-xl font-bold text-[#ff4d4d]">
              De <s>{BONUS.price}</s> por R$ 0,00
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#00aeef]">
              O que você vai aprender
            </h3>
            <ol className="divide-y divide-white/10">
              {BONUS.lessons.map((lesson, i) => (
                <li key={lesson} className="flex gap-3 py-2 text-sm text-white">
                  <span className="w-14 shrink-0 font-bold text-[#00aeef]">Aula {i + 1}</span>
                  {lesson}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function OfferSection() {
  const items = [
    ...BOOKS.map((b, i) => ({ label: `Livro ${i + 1}`, name: b.shortTitle, price: b.price })),
    { label: "Bônus", name: BONUS.title, price: BONUS.price },
  ];
  return (
    <section id="oferta" className="scroll-mt-16 bg-black px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#00aeef]/40 bg-gradient-to-b from-[#00182b] to-[#000c17] px-6 py-10 text-center shadow-[0_0_34px_rgba(0,174,239,0.15)] sm:px-12">
        <h2 className="font-[Poppins] text-2xl font-bold text-white sm:text-3xl">
          Garanta essa condição exclusiva com desconto
        </h2>
        <ul className="mx-auto mt-8 max-w-xl space-y-3 text-left">
          {items.map((item) => (
            <li key={item.label} className="flex items-start gap-3 text-white">
              <Check className="mt-0.5 size-5 shrink-0 text-[#00aeef]" aria-hidden />
              <span className="flex-1">
                <strong>{item.label}</strong> — {item.name}
              </span>
              <s className="shrink-0 text-white/60">{item.price}</s>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-lg text-white/70">
          De <s>{COMBO_FROM}</s>
        </p>
        <p className="font-[Poppins] text-4xl font-extrabold text-white sm:text-5xl">
          Por <span className="text-[#00aeef]">{COMBO_PRICE}</span>
        </p>
        <p className="mt-1 text-white/70">à vista, com frete grátis para todo o Brasil</p>
        <div className="mt-8">
          <CtaButton />
        </div>
      </div>
    </section>
  );
}

function SeparateBooks() {
  return (
    <section className="bg-gradient-to-b from-black to-[#00182b] px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          title="Prefere comprar os livros separadamente?"
          subtitle="Os livros avulsos não têm o desconto do combo nem o curso bônus."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BOOKS.map((book) => (
            <article
              key={book.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white text-[#10263b] shadow-xl"
            >
              <picture className="contents">
                <source
                  className="hidden"
                  type="image/avif"
                  srcSet={book.imageAvifSrcSet}
                  sizes="(min-width: 1024px) 326px, (min-width: 640px) calc((100vw - 56px) / 2), calc(100vw - 32px)"
                />
                <img
                  src={book.image}
                  srcSet={book.imageSrcSet}
                  sizes="(min-width: 1024px) 326px, (min-width: 640px) calc((100vw - 56px) / 2), calc(100vw - 32px)"
                  width={640}
                  height={640}
                  decoding="async"
                  alt={book.imageAlt}
                  loading="lazy"
                  className="aspect-square w-full bg-[#f4f6f8] object-cover p-3"
                />
              </picture>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold leading-snug">{book.title}</h3>
                <p className="mt-1 text-sm text-[#47586a]">Autor: Jhonata Teles</p>
                <p className="mt-3 text-sm text-[#47586a]">
                  {book.chapters.length} capítulos · {book.pages} páginas · Frete grátis
                </p>
                <p className="mb-4 mt-auto pt-4 text-2xl font-extrabold">{book.price}</p>
                <a
                  href={book.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-[#04a9e8] px-4 py-3 text-center font-bold text-[#001e33] transition hover:bg-[#29c3fa] motion-reduce:transition-none"
                >
                  Comprar este livro
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-16 bg-[#f3f3f3] px-4 py-16 text-[#0058a2]">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center font-[Poppins] text-2xl font-bold sm:text-3xl">
          Perguntas frequentes
        </h2>
        <div className="divide-y divide-[#0058a2]/30 border-y border-[#0058a2]/30">
          {FAQ.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-center gap-3 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                <ChevronDown
                  className="size-5 shrink-0 transition group-open:rotate-180 motion-reduce:transition-none"
                  aria-hidden
                />
                {item.q}
              </summary>
              <div className="pb-5 pl-8 text-[#3f444b] [&_a]:font-semibold [&_a]:text-[#0058a2] [&_a]:underline">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <SiteShell>
      <style>{`@keyframes bn-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }`}</style>
      <main>
        <Hero />
        <section
          id="livros"
          className="scroll-mt-16 space-y-20 bg-gradient-to-b from-black via-[#00182b] to-[#00325b] px-4 py-16"
        >
          {BOOKS.map((book, i) => (
            <BookSection key={book.id} book={book} index={i} />
          ))}
        </section>
        <BonusSection />
        <OfferSection />
        <SeparateBooks />
        <FaqSection />
      </main>
    </SiteShell>
  );
}
