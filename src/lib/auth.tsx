import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "super_admin" | "admin" | "editor" | "marketing" | "writer" | "developer";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, ready };
}

export function useRoles(user: User | null) {
  return useQuery({
    queryKey: ["roles", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user!.id);
      if (error) return [] as AppRole[];
      return (data ?? []).map((r) => r.role as AppRole);
    },
  });
}

export function useAuth() {
  const { session, user, ready } = useSession();
  const { data: roles = [], isLoading: rolesLoading } = useRoles(user);
  const isStaff = roles.length > 0;
  return {
    session,
    user,
    ready: ready && (!user || !rolesLoading),
    roles,
    isStaff,
    isAdmin: roles.includes("super_admin") || roles.includes("admin"),
  };
}

export async function signOutEverywhere() {
  await supabase.auth.signOut();
}
