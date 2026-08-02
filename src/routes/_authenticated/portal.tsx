import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Container } from "@/components/site/ui";

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
  const pathname = useRouterState({ select: (r) => r.location.pathname });

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
    <Container className="pt-32 pb-24 md:pt-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-eyebrow">Client portal</p>
          <h1 className="text-display mt-3 text-[clamp(2rem,5vw,3rem)]">
            {user?.user_metadata?.["full_name"] ?? user?.email?.split("@")[0] ?? "Welcome"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {isStaff ? (
            <Link to="/admin" className="text-[13px] link-underline">
              Studio CMS
            </Link>
          ) : null}
          <button onClick={signOut} className="text-[13px] text-muted-foreground hover:text-foreground">
            Sign out
          </button>
        </div>
      </div>

      <nav className="mt-10 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`shrink-0 border-b-2 px-4 py-3 text-[13px] transition-colors ${
                active ? "border-foreground text-foreground" : "border-transparent text-subtle hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10">
        <Outlet />
      </div>
    </Container>
  );
}
