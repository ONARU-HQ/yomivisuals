import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "@/components/btf/SiteNav";
import { SiteFooter } from "@/components/btf/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import { RouteProgress } from "@/components/motion";

export function NotFoundComponent() {
  return (
    <div className="flex min-h-[85svh] flex-col justify-center px-5 py-24 md:px-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <p className="text-[11.5px] uppercase tracking-[0.2em] text-muted-foreground">404 — Not Found</p>
        <h1 className="text-display mt-6 max-w-3xl text-[clamp(2.2rem,9vw,5.5rem)] leading-[0.95]">
          This frame doesn't exist.
        </h1>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          The page you're looking for may have moved, been renamed, or never made the final cut.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex min-h-[48px] items-center justify-center bg-primary px-7 py-4 text-[12px] uppercase tracking-[0.18em] text-primary-foreground"
          >
            Back to YV
          </Link>
          <Link
            to="/work"
            className="inline-flex min-h-[48px] items-center justify-center border border-border-strong px-7 py-4 text-[12px] uppercase tracking-[0.18em]"
          >
            View our work
          </Link>
        </div>
      </div>
    </div>
  );
}


export function ErrorComponent({ error: caughtError, reset }: { error: unknown; reset: () => void }) {
  const error = caughtError instanceof Error ? caughtError : new Error(String(caughtError));
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-sm bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-border-strong px-5 py-3 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#090909" },
      { name: "author", content: "Yomi Visuals" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Yomi Visuals" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap",
      },

    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Yomi Visuals",
          url: "https://yomivisuals.com",
          founder: { "@type": "Person", name: "Yomi Onalaru" },
          description:
            "Yomi Visuals is the creative identity of Yomi Onalaru: photography, creative direction and creative technology.",
          address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
          sameAs: ["https://instagram.com/yomi.visuals"],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

export function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <QueryClientProvider client={queryClient}>
      <RouteProgress />
      <SiteNav />
      <main id="main" key={pathname} className="route-fade">
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster />
    </QueryClientProvider>
  );
}
