import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  CreditCard,
  Download,
  FileText,
  FolderLock,
  LogOut,
  MessageCircle,
  User as UserIcon,
} from "lucide-react";

import wedding1 from "@/assets/wedding-1.jpg";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Yomi Visuals" },
      {
        name: "description",
        content: "Your bookings, invoices, contracts and private galleries in one place.",
      },
      { property: "og:title", content: "Account — Yomi Visuals" },
      {
        property: "og:description",
        content: "Everything about your session, in one calm dashboard.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <section className="mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Welcome back
            </p>
            <h1 className="text-display text-2xl text-primary md:text-4xl">Adaeze</h1>
          </div>
        </div>

        {/* Upcoming booking */}
        <article
          className="mt-8 overflow-hidden border border-border bg-card"
          style={{ borderRadius: "16px" }}
        >
          <div className="grid md:grid-cols-5">
            <div className="relative aspect-[16/10] md:col-span-2 md:aspect-auto">
              <img src={wedding1} alt="Session" className="h-full w-full object-cover" />
            </div>
            <div className="p-6 md:col-span-3 md:p-8">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold">
                Upcoming session · Confirmed
              </p>
              <h2 className="mt-2 text-display text-2xl text-primary md:text-3xl">
                Wedding Experience
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <Info label="Date" value="Sat, 14 Jun 2025" />
                <Info label="Time" value="14:00 — 22:00" />
                <Info label="Location" value="Ikoyi, Lagos" />
                <Info label="Photographer" value="Yomi + team" />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-primary hover:border-gold">
                  Reschedule
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-primary hover:border-gold">
                  <MessageCircle className="h-3.5 w-3.5" /> Message studio
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Tile icon={FolderLock} label="Gallery" caption="Ready · 8 memories" to="/gallery" />
          <Tile icon={CalendarDays} label="Bookings" caption="1 upcoming" to="/account" />
          <Tile icon={FileText} label="Contracts" caption="1 signed" to="/account" />
          <Tile icon={CreditCard} label="Invoices" caption="Deposit paid" to="/account" />
        </div>

        {/* Recent activity */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card title="Recent activity">
            <ActivityRow
              icon={Download}
              title="Adaeze downloaded 3 memories"
              time="2 hours ago"
            />
            <ActivityRow icon={FileText} title="Contract signed" time="Yesterday" />
            <ActivityRow icon={CreditCard} title="Deposit received · ₦720,000" time="3 days ago" />
            <ActivityRow icon={CalendarDays} title="Session confirmed" time="1 week ago" />
          </Card>
          <Card title="Studio notes">
            <p className="text-sm leading-relaxed text-muted-foreground">
              We'll share a wardrobe moodboard 10 days before your session. In the meantime,
              feel free to browse the{" "}
              <Link to="/portfolio" className="text-gold underline-offset-4 hover:underline">
                archive
              </Link>{" "}
              for direction.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <Bell className="h-3 w-3" /> Notifications on
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-destructive"
              >
                <LogOut className="h-3 w-3" /> Sign out
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <div className="mt-24" />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-primary">{value}</p>
    </div>
  );
}

function Tile({
  icon: Icon,
  label,
  caption,
  to,
}: {
  icon: typeof FolderLock;
  label: string;
  caption: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col justify-between border border-border bg-card p-5 transition-colors hover:border-gold/40"
      style={{ borderRadius: "14px" }}
    >
      <div className="flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-full border border-border text-gold">
          <Icon className="h-4 w-4" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-warm" />
      </div>
      <div className="mt-8">
        <p className="text-display text-lg text-primary">{label}</p>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </div>
    </Link>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="border border-border bg-card p-6 md:p-7"
      style={{ borderRadius: "16px" }}
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-gold">{title}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function ActivityRow({
  icon: Icon,
  title,
  time,
}: {
  icon: typeof Download;
  title: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm text-primary">{title}</p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
