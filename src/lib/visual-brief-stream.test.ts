import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readBriefStream } from "./visual-brief-stream";
test("split frames and thinking before text do not strand the reader", async () => {
  const encoder = new TextEncoder();
  const events: string[] = [];
  const stream = new ReadableStream<Uint8Array>({ start(c) {
    for (const text of ['{"type":"thinking","text":"Observe"}\n{"ty', 'pe":"text","text":"Direction"}\n', '{"type":"done"}\n']) c.enqueue(encoder.encode(text));
    c.close();
  } });
  await readBriefStream(stream, e => events.push(e.type));
  assert.deepEqual(events, ["thinking", "text", "done"]);
});