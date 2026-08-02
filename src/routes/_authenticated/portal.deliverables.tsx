import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/portal/deliverables")({
  component: PortalDeliverables,
});

function PortalDeliverables() {
  const files = useQuery({
    queryKey: ["portal", "deliverables"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deliverables")
        .select("*")
        .eq("released", true)
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  if (files.isLoading) return <p className="text-[13px] text-muted-foreground">Loading deliverables…</p>;
  if (!files.data?.length)
    return (
      <div className="panel p-10 text-center">
        <p className="text-[15px]">Nothing released yet.</p>
        <p className="mt-3 text-[13.5px] text-muted-foreground">
          Final files and links appear here as soon as the studio releases them.
        </p>
      </div>
    );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {files.data.map((f: any) => (
        <a
          key={f.id}
          href={f.url}
          target="_blank"
          rel="noreferrer"
          className="panel hover-lift flex items-start justify-between gap-4 p-6"
        >
          <div className="min-w-0">
            <p className="text-[14.5px] text-foreground">{f.label}</p>
            {f.description ? <p className="mt-2 text-[13px] text-muted-foreground">{f.description}</p> : null}
            <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{f.kind}</p>
          </div>
          <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
        </a>
      ))}
    </div>
  );
}
