import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Inbox, Receipt, Layers, Images, GitBranch, Mail, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { collections } from "@/lib/admin-config";
import { AppShell } from "@/components/btf/AppShell";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Yomi Visuals" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { isStaff, ready } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!ready) {
    return <div className="grid min-h-[60svh] place-items-center text-[13px] text-muted-foreground">Loading…</div>;
  }

  if (!isStaff) {
    return (
      <div className="grid min-h-[80svh] place-items-center px-5 text-center">
        <div>
          <h1 className="text-display text-3xl">Staff access only</h1>
          <p className="mt-4 max-w-sm text-[14px] text-muted-foreground">
            This account doesn't have studio permissions. Head to your client portal instead.
          </p>
          <Link
            to="/portal"
            className="mt-8 inline-flex rounded-full border border-border-strong px-6 py-3 text-[13px]"
          >
            Go to client portal
          </Link>
        </div>
      </div>
    );
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const nav = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/admin/pipeline", label: "Pipeline", icon: GitBranch },
    { to: "/admin/design-studio", label: "Design Studio", icon: Layers },
    { to: "/admin/homepage", label: "Homepage concepts", icon: Images },
    { to: "/admin/team", label: "Team", icon: Users },
    { to: "/admin/inbox", label: "Inbox", icon: Inbox },
    { to: "/admin/invoices", label: "Invoices", icon: Receipt },
    { to: "/admin/work", label: "Work", icon: Layers },
    { to: "/admin/portfolio", label: "Media library", icon: Images },
    { to: "/admin/communications", label: "Comms", icon: Mail },
  ];

  return (
    <AppShell
      area="Studio CMS"
      items={nav}
      sections={[{ heading: "Content", items: collections.map((c) => ({ to: `/admin/collections/${c.key}`, label: c.label, icon: Layers })) }]}
      switchTo={{ to: "/portal", label: "Client portal" }}
      onSignOut={signOut}
    >
      <Outlet />
    </AppShell>
  );
}
