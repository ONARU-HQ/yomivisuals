import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { collections } from "@/lib/admin-config";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

function useCount(table: string, build?: (q: any) => any) {
  return useQuery({
    queryKey: ["admin-count", table, build?.toString()],
    queryFn: async () => {
      let q = (supabase as any).from(table).select("id", { count: "exact", head: true });
      if (build) q = build(q);
      const { count, error } = await q;
      if (error) throw new Error(error.message);
      return count ?? 0;
    },
  });
}

function Stat({ label, value, to, tone }: { label: string; value: number | undefined; to: string; tone?: string }) {
  return (
    <Link to={to} className="panel hover-lift block p-6">
      <p className="text-eyebrow">{label}</p>
      <p className={`text-display mt-4 text-[2.4rem] ${tone ?? ""}`}>{value ?? "—"}</p>
    </Link>
  );
}

function AdminOverview() {
  const newBriefs = useCount("project_briefs", (q) => q.eq("stage", "new_brief"));
  const newLeads = useCount("leads", (q) => q.eq("status", "new"));
  const pendingBookings = useCount("bookings", (q) => q.eq("status", "pending"));
  const unpaid = useCount("invoices", (q) => q.eq("status", "unpaid"));
  const subscribers = useCount("subscribers");

  const recent = useQuery({
    queryKey: ["admin-recent-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, name, email, service, status, reference, created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  return (
    <div>
      <p className="text-eyebrow">Overview</p>
      <h1 className="text-display mt-3 text-[clamp(2rem,5vw,3rem)]">Studio control room.</h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="New briefs" value={newBriefs.data} to="/admin/pipeline" tone="text-gold" />
        <Stat label="New leads" value={newLeads.data} to="/admin/inbox" />
        <Stat label="Pending bookings" value={pendingBookings.data} to="/admin/inbox" />
        <Stat label="Unpaid invoices" value={unpaid.data} to="/admin/invoices" />
        <Stat label="Subscribers" value={subscribers.data} to="/admin/inbox" />
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <div className="panel p-6 lg:col-span-2">
          <p className="text-eyebrow">Latest booking requests</p>
          <ul className="mt-5 divide-y divide-border">
            {(recent.data ?? []).map((b: any) => (
              <li key={b.id} className="flex items-center justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-[14px] text-foreground">{b.name}</p>
                  <p className="truncate text-[12px] text-muted-foreground">
                    {b.service ?? "General enquiry"} · {b.reference ?? "—"}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-border px-3 py-1 text-[11px] capitalize text-subtle">
                  {b.status}
                </span>
              </li>
            ))}
            {recent.data?.length === 0 ? (
              <li className="py-6 text-[13px] text-muted-foreground">No booking requests yet.</li>
            ) : null}
          </ul>
          <Link to="/admin/inbox" className="mt-6 inline-block text-[13px] link-underline">
            Open inbox
          </Link>
        </div>

        <div className="panel p-6">
          <p className="text-eyebrow">Collections</p>
          <ul className="mt-5 space-y-1">
            {collections.map((c) => (
              <li key={c.key}>
                <Link
                  to="/admin/collections/$collection"
                  params={{ collection: c.key }}
                  className="block rounded-[10px] px-3 py-2 text-[13px] text-subtle transition-colors hover:bg-elevated hover:text-foreground"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
