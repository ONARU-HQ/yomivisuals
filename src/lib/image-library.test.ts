import { test } from "node:test";
import { strict as assert } from "node:assert";
import { imageProjectType, uniqueImages } from "./image-library";

test("project-type grouping does not infer a brand from a title", () => {
  const image = { title: "Wrong Brand — 01", category: "Commercial", project_type: "Fashion & Editorial" };
  assert.equal(imageProjectType(image), "Fashion & Editorial");
});
test("duplicate image URLs have one library entry", () => {
  assert.deepEqual(uniqueImages([{ url: "a", id: 1 }, { url: "a", id: 2 }, { url: "b", id: 3 }]).map(i => i.id), [1, 3]);
});