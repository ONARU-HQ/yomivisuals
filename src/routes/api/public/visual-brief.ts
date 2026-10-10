import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/public/visual-brief")({
  server: { handlers: { POST: async ({ request }) => {
    const { handleVisualBrief } = await import("@/lib/ai/visual-brief.server");
    return handleVisualBrief(request);
  } } },
});