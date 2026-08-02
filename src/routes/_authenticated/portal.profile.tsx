import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button, Field, inputClass } from "@/components/site/ui";

export const Route = createFileRoute("/_authenticated/portal/profile")({
  component: PortalProfile,
});

function PortalProfile() {
  const { user } = useAuth();
  const [name, setName] = useState<string>((user?.user_metadata?.["full_name"] as string) ?? "");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setState("saving");
    const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", user!.id);
    setState(error ? "error" : "saved");
  }

  return (
    <div className="panel max-w-xl space-y-5 p-6 md:p-8">
      <Field label="Full name">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Email">
        <input className={inputClass} value={user?.email ?? ""} readOnly />
      </Field>
      <Button type="button" disabled={state === "saving"} onClick={save}>
        {state === "saving" ? "Saving…" : "Save profile"}
      </Button>
      {state === "saved" ? <p className="text-[13px] text-muted-foreground">Profile updated.</p> : null}
      {state === "error" ? <p className="text-[13px] text-destructive">Could not save. Please try again.</p> : null}
    </div>
  );
}
