import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import {
  generateDocument,
  sampleDocument,
  type DocumentKind,
  type DocumentSpec,
} from "@/lib/comms/documents.server";

const KINDS: DocumentKind[] = ["invoice", "quote", "proposal", "contract"];

async function requireUser(request: Request) {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const client = createClient(
    process.env["SUPABASE_URL"] ?? import.meta.env["VITE_SUPABASE_URL"],
    process.env["SUPABASE_ANON_KEY"] ?? import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
    { auth: { persistSession: false } },
  );
  const { data } = await client.auth.getUser(token);
  return data.user ?? null;
}

export const Route = createFileRoute("/api/documents/$kind")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const kind = params.kind as DocumentKind;
        if (!KINDS.includes(kind)) return new Response("Unknown document type", { status: 404 });

        const user = await requireUser(request);
        if (!user) return new Response("Unauthorized", { status: 401 });

        let spec: DocumentSpec;
        try {
          const body = (await request.json()) as Partial<DocumentSpec> & { sample?: boolean };
          spec = body.sample ? sampleDocument(kind) : ({ ...body, kind } as DocumentSpec);
        } catch {
          spec = sampleDocument(kind);
        }

        const bytes = await generateDocument(spec);
        return new Response(bytes as unknown as BodyInit, {
          headers: {
            "content-type": "application/pdf",
            "content-disposition": `inline; filename="Yomi-Visuals-${kind}-${spec.number ?? "document"}.pdf"`,
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
