import { createFileRoute, redirect } from "@tanstack/react-router";

/** Retired in the Beyond the Frame redesign. Kept as a redirect so old links still work. */
export const Route = createFileRoute("/start-a-project")({
  beforeLoad: () => {
    throw redirect({ to: "/collaborate" });
  },
});
