export type BriefEvent = { type: "text" | "thinking" | "done" | "error"; text?: string; message?: string };
export async function readBriefStream(body: ReadableStream<Uint8Array>, onEvent: (event: BriefEvent) => void) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let completed = false;
  const line = (raw: string) => {
    if (!raw.trim()) return;
    const event = JSON.parse(raw) as BriefEvent;
    if (event.type === "done") completed = true;
    if (event.type === "error") throw new Error(event.message || "The visual brief could not be generated.");
    onEvent(event);
  };
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      lines.forEach(line);
    }
    buffer += decoder.decode();
    line(buffer);
    if (!completed) throw new Error("The connection ended before your brief was complete. Your partial brief is preserved.");
  } finally { reader.releaseLock(); }
}