import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/btf/AppShell";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [
      { title: "Client Portal — Yomi Visuals" },
      { name: "description", content: "Track your Yomi Visuals bookings, invoices and deliverables." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PortalLayout,
});

const tabs = [
  { to: "/portal", label: "Bookings", exact: true },
  { to: "/portal/invoices", label: "Invoices" },
  { to: "/portal/deliverables", label: "Deliverables" },
  { to: "/portal/profile", label: "Profile" },
];

function PortalLayout() {
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Attach any guest bookings placed with this email to the account.
  useEffect(() => {
    if (!user?.email) return;
    supabase
      .from("bookings")
      .update({ user_id: user.id })
      .is("user_id", null)
      .eq("email", user.email)
      .then(() => queryClient.invalidateQueries({ queryKey: ["portal"] }));
  }, [user?.id, user?.email, queryClient]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <AppShell
      area="Client portal"
      title={user?.user_metadata?.["full_name"] ?? user?.email?.split("@")[0] ?? "Welcome"}
      items={tabs}
      switchTo={isStaff ? { to: "/admin", label: "Studio CMS" } : undefined}
      onSignOut={signOut}
    >
      <Outlet />
    </AppShell>
  );
}
