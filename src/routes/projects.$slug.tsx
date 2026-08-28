import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL — case studies now live at /work/$slug. */
export const Route = createFileRoute("/projects/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/work/$slug", params: { slug: params.slug }, replace: true });
  },
});
