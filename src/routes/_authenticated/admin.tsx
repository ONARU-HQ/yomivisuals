import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Inbox, FileText, Receipt, LogOut, Layers, Images, GitBranch, Mail, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { collections } from "@/lib/admin-config";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Yomi Visuals" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { isStaff, ready } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

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
    { to: "/admin/team", label: "Team", icon: Users },
    { to: "/admin/inbox", label: "Inbox", icon: Inbox },
    { to: "/admin/invoices", label: "Invoices", icon: Receipt },
    { to: "/admin/work", label: "Work", icon: Layers },
    { to: "/admin/portfolio", label: "Media library", icon: Images },
    { to: "/admin/communications", label: "Comms", icon: Mail, Users },
  ];


  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-border px-5 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <Link to="/" className="text-[14px] font-semibold tracking-[-0.04em]">
            Yomi Visuals
          </Link>
          <p className="text-eyebrow mt-1">Studio CMS</p>

          <nav className="mt-8 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {nav.map((n) => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex shrink-0 items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] transition-colors ${
                    active ? "bg-elevated text-foreground" : "text-subtle hover:text-foreground"
                  }`}
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <p className="text-eyebrow mt-8 hidden lg:block">Content</p>
          <nav className="mt-3 hidden flex-col gap-0.5 lg:flex">
            {collections.map((c) => {
              const to = `/admin/collections/${c.key}`;
              const active = pathname === to;
              return (
                <Link
                  key={c.key}
                  to="/admin/collections/$collection"
                  params={{ collection: c.key }}
                  className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] transition-colors ${
                    active ? "bg-elevated text-foreground" : "text-subtle hover:text-foreground"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  {c.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 flex gap-2 lg:flex-col">
            <Link
              to="/"
              className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] text-subtle transition-colors hover:text-foreground"
            >
              <FileText className="h-3.5 w-3.5" /> View site
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-[13px] text-subtle transition-colors hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
