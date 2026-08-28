import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL — the briefing flow now lives at /start-a-project. */
export const Route = createFileRoute("/book")({
  beforeLoad: () => {
    throw redirect({ to: "/start-a-project", replace: true });
  },
});
