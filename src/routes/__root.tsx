import { publicUrl, productionUrl } from "@/lib/site-url";
import { analyticsBootstrap } from "@/lib/analytics";
import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import inlineCss from "../styles.css?inline";
import montserratFont from "../fonts/montserrat-latin.woff2?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href={publicUrl("")}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Black November Livros — Engeteles" },
      {
        name: "description",
        content:
          "Combo de livros de manutenção da Engeteles com curso bônus e frete grátis. Oferta Black November.",
      },
      { name: "author", content: "Engeteles" },
      { property: "og:title", content: "Black November Livros — Engeteles" },
      {
        property: "og:description",
        content:
          "Combo de livros de manutenção da Engeteles com curso bônus e frete grátis. Oferta Black November.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: productionUrl("assets/black-november-livros.webp") },
      { property: "og:locale", content: "pt_BR" },
    ],
    links: [
      ...(import.meta.env.PROD ? [] : [{ rel: "stylesheet", href: appCss }]),
      { rel: "icon", href: publicUrl("favicon.ico"), sizes: "48x48" },
      { rel: "icon", href: publicUrl("favicon.png"), type: "image/png", sizes: "512x512" },
      { rel: "apple-touch-icon", href: publicUrl("apple-touch-icon.png") },
      {
        rel: "preload",
        href: montserratFont,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
    scripts: [
      // Google Tag Manager da Engeteles, em todas as páginas.
      {
        children: analyticsBootstrap,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        {import.meta.env.PROD && <style dangerouslySetInnerHTML={{ __html: inlineCss }} />}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
