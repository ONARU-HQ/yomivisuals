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
    // Same lead UUID on every attempt. TRYSA deduplicates all accepted events.
    const payload = JSON.stringify({
      source_app: "yomi_contact",
      event_id: lead.id,
      intent: "consultation",
      created_at: lead.created_at,
    });
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const result = await fetch(
          "https://ccaxvjrgjpaixvyrgizn.supabase.co/functions/v1/dejavu-external-sales-intake-v1",
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
            body: payload,
            signal: AbortSignal.timeout(3500),
          },
        );
        if (result.ok) {
          const receipt: unknown = await result.json().catch(() => null);
          const confirmed = receipt !== null && typeof receipt === "object" &&
            "ok" in receipt && receipt.ok === true &&
            "task_id" in receipt && typeof receipt.task_id === "string";
          if (confirmed) return { synced: true };
          console.warn("[DEJAVU] Contact intake returned invalid acknowledgement");
          return { synced: false, reason: "unconfirmed_receipt" };
        }
        // Fail closed on authorization and validation errors; retry only temporary failures.
        if (![408, 429, 500, 502, 503, 504].includes(result.status)) {
          console.warn("[DEJAVU] Contact intake rejected", result.status);
          return { synced: false, reason: "rejected" };
        }
        if (attempt === 2) console.warn("[DEJAVU] Contact intake retry exhausted", result.status);
      } catch {
        if (attempt === 2) console.warn("[DEJAVU] Contact intake unavailable after retry");
      }
      if (attempt === 1) await new Promise<void>((resolve) => setTimeout(resolve, 250));
    }
    return { synced: false, reason: "retry_exhausted" };
  });
