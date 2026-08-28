import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL — the archive now lives at /work. */
export const Route = createFileRoute("/projects/")({
  beforeLoad: () => {
    throw redirect({ to: "/work", replace: true });
  },
});
