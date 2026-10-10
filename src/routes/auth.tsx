import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { usernameSignIn } from "@/lib/team.functions";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Container, Field, inputClass, Button } from "@/components/site/ui";

type Search = { redirect?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign In — Yomi Visuals Client Portal" },
      {
        name: "description",
        content: "Sign in to the Yomi Visuals client portal to track bookings, invoices and deliverables.",
      },
      { property: "og:title", content: "Sign In — Yomi Visuals Client Portal" },
      { property: "og:description", content: "Access your Yomi Visuals bookings, invoices and deliverables." },
      { property:"og:type",content:"website" },{ name:"twitter:card",content:"summary" },{ name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const loginWithUsername=useServerFn(usernameSignIn);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const { user, isStaff, ready } = useAuth();

  useEffect(() => {
    if (!ready || !user) return;
    if (search.redirect) {
      navigate({ to: search.redirect as string, replace: true });
      return;
    }
    navigate({ to: isStaff ? "/admin" : "/portal", replace: true });
  }, [ready, user, isStaff, navigate, search.redirect]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: window.location.origin + "/auth",
          data: { full_name: name.trim() },
        },
      });
      setBusy(false);
      if (err) return setError(err.message);
      if (!data.session) setNotice("Check your inbox to confirm your email, then sign in.");
      return;
    }
    try {if(email.includes('@')){const {error:err}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(err)throw err;}else{const session=await loginWithUsername({data:{username:email.trim(),password}});const {error:err}=await supabase.auth.setSession(session);if(err)throw err;}}catch(e){setError(e instanceof Error?e.message:'Sign-in failed.');}finally{setBusy(false);}
  }

  return (
    <Container className="flex min-h-[100svh] items-center justify-center py-32">
      <div className="w-full max-w-md">
        <Link to="/" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
          ← Yomi Visuals
        </Link>
        <h1 className="text-display mt-6 text-[clamp(2rem,6vw,2.8rem)]">
          {mode === "signin" ? "Sign in." : "Create an account."}
        </h1>
        <p className="mt-4 text-[14px] text-muted-foreground">
          Track your bookings, download invoices and collect deliverables in one place.
        </p>

        <form onSubmit={onSubmit} className="panel mt-8 space-y-4 p-6 md:p-8">
          {mode === "signup" ? (
            <Field label="Full name">
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Ada Obi" />
            </Field>
          ) : null}
          <Field label={mode==='signin'?"Username or email":"Email"}>
            <input
              type={mode==='signin'?"text":"email"}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder={mode==='signin'?"Username or email":"you@company.com"}
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              required
              {...(mode === "signup" ? { minLength: 8 } : {})}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
            />
          </Field>

          {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
          {notice ? <p className="text-[13px] text-muted-foreground">{notice}</p> : null}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>

          <Button variant="ghost"
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            className="w-full text-center text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {mode === "signin" ? "No account yet? Create one" : "Already have an account? Sign in"}
          </Button>
          {mode==='signin'?<Button variant="ghost" type="button" onClick={async()=>{if(!email.includes('@')){setError('Enter your account email for password recovery.');return;}const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+'/reset-password'});if(error)setError(error.message);else setNotice('If this account exists, a recovery email has been sent.');}}>Forgot password?</Button>:null}
        </form>
      </div>
    </Container>
  );
}
