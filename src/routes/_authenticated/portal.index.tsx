import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatMoney, stageLabels, stageOrder } from "@/lib/billing";

export const Route = createFileRoute("/_authenticated/portal/")({
  component: PortalBookings,
});

function PortalBookings() {
  const bookings = useQuery({
    queryKey: ["portal", "bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  if (bookings.isLoading) return <p className="text-[13px] text-muted-foreground">Loading your bookings…</p>;

  if (!bookings.data?.length) {
    return (
      <div className="panel p-10 text-center">
        <p className="text-[15px]">No bookings yet.</p>
        <p className="mt-3 text-[13.5px] text-muted-foreground">
          Once you request a consultation with the email on this account, it appears here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {bookings.data.map((b: any) => {
        const idx = Math.max(0, stageOrder.indexOf(b.stage ?? "requested"));
        return (
          <article key={b.id} className="panel p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-eyebrow">{b.reference ?? "Booking"}</p>
                <h2 className="text-display mt-2 text-xl md:text-2xl">{b.service ?? "Creative consultation"}</h2>
                <p className="mt-2 text-[13px] text-muted-foreground">
                  Requested {new Date(b.created_at).toLocaleDateString()}
                  {b.preferred_date ? ` · Preferred ${b.preferred_date}${b.preferred_time ? ` at ${b.preferred_time}` : ""}` : ""}
                </p>
              </div>
              <div className="text-right">
                <span className="rounded-full border border-border px-3 py-1 text-[11px] capitalize text-subtle">
                  {b.status}
                </span>
                {b.amount ? <p className="mt-3 text-[14px]">{formatMoney(b.amount, b.currency)}</p> : null}
              </div>
            </div>

            <ol className="mt-8 grid gap-3 sm:grid-cols-4">
              {stageOrder.map((s, i) => (
                <li key={s}>
                  <div className={`h-[2px] w-full ${i <= idx ? "bg-foreground" : "bg-border"}`} />
                  <p className={`mt-3 text-[12px] ${i <= idx ? "text-foreground" : "text-muted-foreground"}`}>
                    {stageLabels[s]}
                  </p>
                </li>
              ))}
            </ol>

            {b.message ? (
              <p className="mt-6 rounded-[10px] border border-border bg-elevated p-4 text-[13px] leading-relaxed text-subtle">
                {b.message}
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
