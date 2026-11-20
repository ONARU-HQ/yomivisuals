/**
 * Server-only, contact-form → DEJAVU internal research handoff.
 * Never accepts arbitrary visitor data as a sales opportunity; the lead must
 * exist in this site's own database. No PII or marketing consent is forwarded.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const notifyDejavuContactLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ leadId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const secret = process.env["DEJAVU_YOMI_VISUALS_INGEST_SECRET"];
    if (!secret || secret.length < 32) return { synced: false, reason: "not_configured" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: lead, error } = await supabaseAdmin.from("leads")
      .select("id,source,created_at").eq("id", data.leadId).eq("source", "contact").maybeSingle();
    if (error || !lead) return { synced: false, reason: "lead_not_found" };
    try {
      const result = await fetch(
        "https://ccaxvjrgjpaixvyrgizn.supabase.co/functions/v1/dejavu-external-sales-intake-v1",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
          body: JSON.stringify({ source_app: "yomi_contact", event_id: lead.id,
            intent: "consultation", created_at: lead.created_at }),
          signal: AbortSignal.timeout(2500),
        },
      );
      return { synced: result.ok };
    } catch {
      return { synced: false, reason: "bridge_unavailable" };
    }
  });
